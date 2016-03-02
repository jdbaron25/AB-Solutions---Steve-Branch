var conn = Titanium.Database.open('mysdb');
conn.execute('CREATE TABLE IF NOT EXISTS authData (userID TEXT, firstName TEXT, lastName TEXT, email TEXT, authToken TEXT)');
conn.execute('CREATE TABLE IF NOT EXISTS imageData(resiD TEXT, termID TEXT, filename TEXT)');
conn.execute('CREATE TABLE IF NOT EXISTS responseHeader (survey_result_id TEXT, terminal_id TEXT, survey_Date TEXT, user_id TEXT, terminal_inaccessible TEXT, terminal_access_attempt TEXT, entered_date TEXT)');
conn.execute('CREATE TABLE IF NOT EXISTS responses (survey_result_id TEXT, question_id TEXT, question_type TEXT, question_text TEXT, value TEXT, comments TEXT)');
conn.execute('CREATE TABLE IF NOT EXISTS surveyResultsComplete (terminal TEXT, survey_result_id TEXT, survey_revision_id TEXT, complete TEXT, uploaded TEXT, serial_number TEXT)');
conn.execute('CREATE TABLE IF NOT EXISTS surveyResults (terminal TEXT, survey_result_id TEXT, survey_revision_id TEXT, complete TEXT, uploaded TEXT, serial_number TEXT)');
conn.execute('CREATE TABLE IF NOT EXISTS questions (revID TEXT, qtext TEXT, qorder TEXT, type TEXT, has_comment TEXT, comment_req_mapping TEXT, question_id TEXT)');
conn.execute('CREATE TABLE IF NOT EXISTS answers (qid TEXT, id TEXT, value TEXT, qorder TEXT, default_map TEXT, revID TEXT)');
conn.execute('CREATE TABLE IF NOT EXISTS terminals (id TEXT, serialnumber TEXT, location TEXT, street TEXT, city TEXT, state TEXT, zip TEXT)');
conn.execute('CREATE TABLE IF NOT EXISTS settings (imageWidth INT, imageHeight INT)');
conn.close();

Titanium.include('db_migration.js');