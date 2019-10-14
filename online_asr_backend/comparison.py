import json
import csv

with open('AndrewQAScore.json') as json_file:
    data_Andrew = json.load(json_file)

with open('JamieQAScore.json') as json_file:
	data_Jamie = json.load(json_file)

i = 0

with open('compare.csv', 'w') as csvfile:
    fieldnames = ['Actual_Question', 'Query_question', 'Actual_Answer', 'Andrew_QA_reply', 'Jamie_QA_reply']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()

    while i < len(data_Andrew):

    	writer.writerow({'Actual_Question': data_Andrew[i]['Actual_qestion'], 'Query_question': data_Andrew[i]['Speech_Query'], 'Actual_Answer': data_Andrew[i]['Actual_answer'], 
    					'Andrew_QA_reply': data_Andrew[i]['Predicted_answer'], 'Jamie_QA_reply': data_Jamie[i]['predicted_answer']})
    	i = i + 1

    