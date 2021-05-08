-- Query 1: Avg mood of songs in users playlist
SELECT p.name, AVG(mood) as avg_mood
FROM Playlists p
JOIN Songs s
ON p.song_id = s.spotify_id
WHERE email = 'test@email.com'
GROUP BY p.name

-- Query 2: search for song based on its mood/tempo being > some amount given
SELECT spotify_id, title, artist
FROM Songs 
WHERE tempo > 200 AND mood > 0.8
ORDER BY title
LIMIT 20


-- Query 3: find attributes of song based on some given name (search for song)
SELECT title, artist, mood, tempo, danceability
FROM Songs
WHERE title = 'After Hours'
ORDER BY title
LIMIT 10


-- Query 4: get mood of saved songs for a particular user
SELECT ss.song_id, title, artist, mood
FROM SavedSongs ss
JOIN Songs s
ON s.spotify_id = ss.song_id
WHERE ss.email = 'adam30@yahoo.com'
ORDER BY mood DESC, title

-- Query 5: get avg sentiment of each decade (DECADE: decade function)
SELECT floor(year(release_year)/10)*10 as decade, AVG(mood) as avg_mood
FROM Songs s
GROUP BY floor(year(release_year)/10)*10
ORDER BY floor(year(release_year)/10)*10;


-- Query 6: max danceability of a song from 2000s which use explicit words and are positive?
SELECT spotify_id, title, artist, MAX(danceability) as max_danceability
FROM Songs
WHERE explicit AND mood > 0.7 AND YEAR(release_year) >= 2000 AND YEAR(release_year) <= 2009
GROUP BY spotify_id 



-- Query 7: find "best songs" (songs who have higher popularity compared to their decade)
WITH DesiredSongs AS (
      SELECT spotify_id, title, artist, popularity
      FROM Songs s
      WHERE YEAR(release_year) >= 2000 AND YEAR(release_year) <= 2009
), AvgPopularityDecade AS (
    SELECT AVG(popularity) as avg_popularity
    FROM DesiredSongs
)
SELECT *
FROM DesiredSongs ds, AvgPopularityDecade apd
WHERE ds.popularity > apd.avg_popularity
LIMIT 10

-- Query 8: only select songs whose mood/popularity > avg within your saved playlists (recommendations)
WITH AllUserSavedSongs AS (
  SELECT spotify_id, ss.email, mood, popularity
  FROM Songs s
  JOIN SavedSongs ss
  ON s.spotify_id  = ss.song_id
  WHERE ss.email = 'test@email.com'
), AllUserSongs AS (
  SELECT s.spotify_id, au.email, s.mood, s.popularity
  FROM AllUserSavedSongs au
  JOIN Playlists p
  ON au.email = p.email
  JOIN Songs s
  ON au.spotify_id = s.spotify_id
), AvgMoodPopularitySongs AS (
	SELECT AVG(mood) as avg_mood, AVG(popularity) as avg_popularity
	FROM AllUserSongs
)
SELECT spotify_id, title, artist
FROM Songs s, AvgMoodPopularitySongs amp
WHERE s.mood > amp.avg_mood AND s.popularity > amp.avg_popularity
ORDER BY title
LIMIT 10



-- Query 9: avg tempo of saved songs from people born in a particular decade
WITH PeopleInDecade AS (
	SELECT email, spotify_id, dob as birth_date
	FROM Users
	WHERE dob between '1990-01-01' and '1999-12-30'
),
PeopleInDecadeSavedSongs AS (
	SELECT u.email, s.spotify_id, artist as artist, title as title, tempo, mood
	FROM PeopleInDecade u
	JOIN SavedSongs ss
	ON ss.email = u.email
	JOIN Songs s
	ON ss.song_id = s.spotify_id
)
SELECT email, AVG(tempo) as avg_tempo, AVG(mood) as avg_mood
FROM PeopleInDecadeSavedSongs
GROUP BY email


-- Query 10: for songs in playlists of people born after December 1990 with above average loudness for that decade (1990 - 1999), what is the average danceability of the songs?
WITH DesiredUsersPlaylistSongs AS (
	SELECT u.email, u.dob, p.song_id, s.title, s.artist, s.loudness
	FROM Users u
	JOIN Playlists p
	ON u.email = p.email
	JOIN Songs s
	ON s.spotify_id = p.song_id 
	WHERE u.dob >= '1990-12-01'
), AvgLoudnessDecade AS (
   SELECT AVG(loudness) as avg_loudness
   FROM Songs s
   WHERE YEAR(s.release_year) >= 1990 AND YEAR(s.release_year) <= 1999
), DesiredSongs AS (
   SELECT song_id, title, artist, loudness
   FROM DesiredUsersPlaylistSongs dps, AvgLoudnessDecade
   WHERE loudness > avg_loudness
)
SELECT * FROM DesiredSongs





-- Actual queries being used ---

/* genre recommendation unoptimized*/
WITH user_saved_songs_genres AS (
	SELECT ss.song_id, ag.genre, CEIL(s.acousticness * 10) AS mood_bucket, s.popularity 
	FROM SavedSongs ss
	JOIN ArtistsSongs ats ON ats.song_id = ss.song_id
	JOIN ArtistsGenres ag ON ag.artist_id = ats.artist_id 
	JOIN Songs s ON s.spotify_id = ats.song_id 
	WHERE ss.email = "aoconnell@pfeffer.com"
),
songs_per_top_mood_bucket AS (
	SELECT ussg0.mood_bucket, COUNT(ussg0.song_id) AS num_songs
	FROM user_saved_songs_genres ussg0
	GROUP BY ussg0.mood_bucket
	ORDER BY num_songs DESC 
	LIMIT 2
),
average_saved_songs_popularity AS (
	SELECT AVG(popularity) AS avg_popularity
	FROM user_saved_songs_genres
),
unknown_genres AS (
	SELECT DISTINCT ag2.genre 
	FROM ArtistsGenres ag2 
	WHERE ag2.genre NOT IN (
		SELECT DISTINCT ussg.genre 
		FROM user_saved_songs_genres ussg
	)
),
unknown_genre_mood_range AS (
	SELECT ug.genre, CEIL(AVG(s2.acousticness) * 10) AS mood_bucket, COUNT(s2.spotify_id) AS num_songs, AVG(s2.popularity) AS genre_popularity 
	FROM ArtistsGenres ag3 
	JOIN unknown_genres ug ON ug.genre = ag3.genre 
	JOIN ArtistsSongs as2 ON as2.artist_id = ag3.artist_id 
	JOIN Songs s2 ON s2.spotify_id = as2.song_id
	GROUP BY ag3.genre 
)
SELECT ugmr.genre, ugmr.mood_bucket, ugmr.num_songs 
FROM unknown_genre_mood_range ugmr
JOIN average_saved_songs_popularity assp
JOIN songs_per_top_mood_bucket sptmb ON sptmb.mood_bucket = ugmr.mood_bucket
WHERE ugmr.genre_popularity >= assp.avg_popularity
ORDER BY num_songs DESC
LIMIT 10;

/* genre recommendation optimized*/
WITH user_saved_songs_genres AS (
        SELECT ss.song_id, ag.genre, CEIL(s.acousticness * 10) AS mood_bucket, s.popularity 
        FROM SavedSongs ss
        JOIN ArtistsSongs ats ON ats.song_id = ss.song_id
        JOIN ArtistsGenres ag ON ag.artist_id = ats.artist_id 
        JOIN Songs s ON s.spotify_id = ats.song_id 
        WHERE ss.email = "${user_email}"
    ),
    songs_per_top_mood_bucket AS (
        SELECT ussg0.mood_bucket, COUNT(ussg0.song_id) AS num_songs
        FROM user_saved_songs_genres ussg0
        GROUP BY ussg0.mood_bucket
        ORDER BY num_songs DESC 
        LIMIT 2
    ),
    average_saved_songs_popularity AS (
        SELECT AVG(popularity) AS avg_popularity
        FROM user_saved_songs_genres
    ),
    unknown_genres AS (
        SELECT DISTINCT ag2.genre 
        FROM ArtistsGenres ag2 
        WHERE ag2.genre NOT IN (
            SELECT DISTINCT ussg.genre 
            FROM user_saved_songs_genres ussg
        )
    ),
    unknown_genre_mood_range AS (
        SELECT ug.genre, CEIL((g.acousticness) * 10) AS mood_bucket, g.popularity, g.num_songs
        FROM unknown_genres ug
        JOIN Genres g ON g.genre = ug.genre
    )
    SELECT ugmr.genre, ugmr.mood_bucket, ugmr.popularity
    FROM unknown_genre_mood_range ugmr
    JOIN songs_per_top_mood_bucket sptmb ON sptmb.mood_bucket = ugmr.mood_bucket
    JOIN average_saved_songs_popularity assp
    WHERE ugmr.popularity >= assp.avg_popularity
    ORDER BY ugmr.num_songs DESC
    LIMIT 10;

/* artist recommendation unoptimized (based on artists user hasn't listened to) */
WITH top_genres AS (
	SELECT ag.genre, count(ss.song_id) AS savedsongs_in_genre
	FROM SavedSongs ss 
	JOIN ArtistsSongs ats ON ats.song_id = ss.song_id
	JOIN ArtistsGenres ag ON ag.artist_id = ats.artist_id 
	WHERE ss.email = "aoconnell@pfeffer.com"
	GROUP BY ag.genre 
	ORDER BY savedsongs_in_genre DESC 
	LIMIT 20
),
unknown_artists AS (
	SELECT a.artist_id, a.name
	FROM Artists a
	WHERE a.artist_id NOT IN (
		SELECT ats2.artist_id FROM ArtistsSongs ats2
		JOIN SavedSongs ss2 ON ss2.song_id = ats2.song_id 
		WHERE ss2.email = "aoconnell@pfeffer.com"
	)
),
unknown_artists_in_top_genres AS (
	SELECT uka.artist_id, uka.name
	FROM ArtistsGenres ag2 
	JOIN top_genres tg ON tg.genre = ag2.genre
	JOIN unknown_artists uka ON uka.artist_id = ag2.artist_id
)
SELECT uatg.artist_id, uatg.name, AVG(s.popularity) AS artist_popularity 
FROM unknown_artists_in_top_genres uatg
JOIN ArtistsSongs ats3 ON ats3.artist_id = uatg.artist_id
JOIN Songs s ON s.spotify_id = ats3.song_id 
GROUP BY uatg.artist_id, uatg.name
ORDER BY artist_popularity DESC 
LIMIT 20;


/* artist recommendation: optimized (based on artists user hasn't listened to) */
WITH savedsongs_genre_artist AS (
	SELECT ss.song_id, ag.genre, ats.artist_id 
	FROM SavedSongs ss 
	JOIN ArtistsSongs ats ON ats.song_id = ss.song_id
	JOIN ArtistsGenres ag ON ag.artist_id = ats.artist_id 
	WHERE ss.email = "aoconnell@pfeffer.com"
),
top_genres AS (
	SELECT genre, COUNT(*) AS songs_in_genre
	FROM savedsongs_genre_artist sga
	GROUP BY sga.genre
	ORDER BY songs_in_genre DESC 
	LIMIT 20
),
unknown_artists AS (
	SELECT a.artist_id, a.name
	FROM Artists a
	WHERE a.artist_id NOT IN (
		SELECT DISTINCT artist_id 
		FROM savedsongs_genre_artist sga2
	)
),
unknown_artists_in_top_genres AS (
	SELECT uka.artist_id, uka.name
	FROM ArtistsGenres ag2 
	JOIN top_genres tg ON tg.genre = ag2.genre
	JOIN unknown_artists uka ON uka.artist_id = ag2.artist_id
)
SELECT uatg.artist_id, uatg.name, AVG(s.popularity) AS artist_popularity 
FROM unknown_artists_in_top_genres uatg
JOIN ArtistsSongs ats3 ON ats3.artist_id = uatg.artist_id
JOIN Songs s ON s.spotify_id = ats3.song_id 
GROUP BY uatg.artist_id, uatg.name
ORDER BY artist_popularity DESC 
LIMIT 20;


/* distribution of moods of saved songs */
SELECT count(ss.song_id), CEIL((mm.mood * 10)) AS mood_bucket
FROM SavedSongs ss 
JOIN Songs s ON s.spotify_id = ss.song_id 
JOIN MoodMetrics mm ON mm.song_id = ss.song_id 
WHERE ss.email = "aoconnell@pfeffer.com"
GROUP BY mood_bucket
ORDER BY mood_bucket ;


/* distribution of dancebility of saved songs */
SELECT count(ss.song_id) AS num_songs, CEIL((s.danceability * 10)) AS dancebility_bucket
FROM SavedSongs ss 
JOIN Songs s ON s.spotify_id = ss.song_id 
WHERE ss.email = "aoconnell@pfeffer.com"
GROUP BY dancebility_bucket
ORDER BY dancebility_bucket;


/* most listened to artist */
WITH artistid_songcount AS (
	SELECT ats.artist_id , count(ss.song_id) AS num_saved_songs
	FROM SavedSongs ss 
	JOIN ArtistsSongs ats ON ats.song_id = ss.song_id
	WHERE ss.email = "aoconnell@pfeffer.com"
	GROUP BY ats.artist_id 
)
SELECT a.name, num_saved_songs 
FROM artistid_songcount atsng
JOIN Artists a ON a.artist_id = atsng.artist_id
ORDER BY num_saved_songs DESC
LIMIT 10;
