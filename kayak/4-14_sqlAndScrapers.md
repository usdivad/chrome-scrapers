#Datamart cat-study
SELECT * FROM l2datamart.ref_study_to_category
JOIN study_study ON study_study.study_id=ref_study_to_category.study_id

#Get the brand tweets that are in reply to mentions
SELECT * FROM t_records_twitter_mentions
JOIN test_t_records_twitter_tweets ON t_records_twitter_mentions.tweet_id=test_t_records_twitter_tweets.in_reply_to_status_id

http://67.217.137.138/dataviz/worldmap/world_map_data.php?brand_id=4&study_category=Retail

comment out transformers in ProcessingModule and intervalHours in UrlDispenser, as well as adding 2014hotels to getUrlsSql in UrlDispenser

SELECT * FROM study_study_to_brand WHERE brand_id=264;


anova

worldmap -> brand_selector.js; it's inefficient atm
so is the new get_brands_w_studies.php maybe?
redundant info
but time

I've been alright! Trying to find a balance of life. Some days I just want to make music all day and some days I lose almost all ambition

----

******ok we actually HAVE ot use a diff one than world_map_data.php because that's the one that's going to filter by category and year, once you've already chosen those parameters!!

***OK so the study_category's are working BUT they're actually being categorized in the same field in refdata.

**Also the jQuery problem is because the JSON objects you're feeding in are too big!!