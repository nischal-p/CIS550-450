-- Query 1: Avg mood of songs in playlist
SELECT spotify_id, title_char as title, artist_char AS artist, AVG(mood) as avg_mood
FROM Playlist p
JOIN Songs s
ON p.spotify_id = s.song_id
WHERE user_email = 'akshaysharma2019' AND p.name = 'something'
GROUP BY spotify_id, title_char, artist_char

-- Query 2: search for song based on its mood/tempo being > some amount given
SELECT spotify_id, title_char AS title, artist_char AS artist
FROM Songs 
WHERE tempo > 0.5 AND mood > 0.8
ORDER BY title_char, LIMIT 20

-- Query 3: find attributes of song based on some given name (search for song)
SELECT title_char as title, artist_char as artist, mood
FROM Songs
WHERE title_char = 'Blinding Lights'
ORDER BY title_char, LIMIT 10

-- Query 4: get mood of saved songs
SELECT ss.song_id, tile_char as title, artist_char as artist, mood
FROM SavedSongs ss
JOIN Songs s
ON s.spotify_id = s.song_id

-- Query 5: get avg sentiment of each decade (DECADE: decade function)
SELECT decade(release_year) as decade, AVG(mood) as avg_mood
FROM Songs s
GROUP BY decade(release_year)


-- Query 6: avg danceability of songs from 2000s which use explicit words and are positive?
SELECT AVG(danceability) as avg_danceability
FROM Songs s
WHERE s.explicit AND mood > 0.7 AND release_year >= 2000 AND m.release_year <= 2009


-- Query 7: find "best songs" (songs who have higher popularity compared to their decade)
WITH DesiredSongs AS (
      SELECT spotify_id, title_char AS title, artist_char AS artist, popularity
      FROM Songs s
      WHERE m.release_year >= 2000 AND m.release_year <= 2009
), AvgPopularityDecade AS (
    SELECT AVG(popularity) as avg_popularity
    FROM DesiredSongs
)
SELECT *
FROM DesiredSongs ds, AvgPopularityDecade apd
WHERE ds.popularity > apd.popularity


-- Query 8: only select songs whose mood/popularity > avg within your saved playlists
WITH AvgMoodPopularity AS (
  SELECT AVG(s.mood) as avg_mood, AVG(s.popularity) as avg_popularity
  FROM SavedSongs ss
  WHERE ss.email = 'akshaysharma2019'
  JOIN Songs s
  ON ss.song_id = s.spotify_id
  JOIN Playlist p
  ON ss.email = p.user_email AND p.song_id = s.spotify_id
)
SELECT spotify_id, title_char AS title, artist_char AS artist
FROM Songs s, AvgMoodPopularity amp
WHERE s.mood > amp.mood AND s.popularity > amp.popularity
ORDER BY title_char
LIMIT 10

-- Query 9: avg tempo of saved songs from people born in a particular decade
WITH PeopleInDecade AS (
    SELECT email, spotify_id, dob as birth_date
    FROM Users
    WHERE dob >= 2000 AND dob <= 2009
), PeopleInDecadeSavedSongs AS (
    SELECT u.email, s.spotify_id, artist_char as artist, title_char as title, tempo, mood 
    FROM Users u
    JOIN SavedSongs ss
    ON ss.email = u.email
    JOIN Songs s
    ON ss.song_id = s.spotify_id
)
SELECT u.email, AVG(tempo) as avg_tempo, AVG(mood) as avg_mood
FROM PeopleInDecadeSavedSongs
GROUP BY u.email

-- Query 10: ?