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

