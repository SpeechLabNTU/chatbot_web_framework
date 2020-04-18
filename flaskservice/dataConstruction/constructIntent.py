import re
import random
import json
import csv

def constructJSON(filename):
    questions = {}
    intentions = []
    f = open(filename, mode='r', encoding='utf-8-sig')
    parsing = False
    for line in f:

        if line not in ['\n','\r\n']:
            if(line.startswith("Permutations")):   
                tag = re.search("of '(.*)':",line)
                tag = tag.group(1)
                questions[tag] = []
                parsing = False
            elif('=' in line):
                parsing = False
            else:
                parsing = True
                
            if parsing:
                line = line.strip()
                questions[tag].append(line)
    
    for k in questions.keys():
        if (int(len(questions[k])<200)):
            pattern = questions[k]
        else:
            pattern = random.sample(questions[k],200)
        tag = k
        intent = {"tag":tag, "patterns": pattern}
        intentions.append(intent)
    
    return intentions


def insert_response(json_intent):
    question = ""
    with open('msf_baby_bonus.csv', 'r') as file:
        reader = csv.reader(file)
        
        for row in reader:
            question = row[1].replace('\n','')
            for item in json_intent["intents"]:
                if (str(item["tag"]) == str(question)):
                    item.update(response=row[2].replace('\n',''))

    return json_intent

def fill_undefined_response(updated_json):

    tag = {"intents":
            [{"q":"Are children of unwed parents eligible to join the Baby Bonus Scheme?","a":"Children of unwed parents are eligible to join the Baby Bonus Scheme if they are Singapore Citizens and were born on, or after 1 September 2016 to the receive CDA benefits. To check if your child is eligible for Baby Bonus, you can use the Check Eligibility on Baby Bonus Online."},
            {"q":"My application status is Action Required by Applicant. What should I do?","a":"If you have submitted an application and the status is “Action Required By Applicant”, please check if the parent details you have keyed in to your application form are the same as those printed on your child’s birth certificate. Changes can be made by using “Update Application/Check Status” on Baby Bonus Online. If you are unable to edit your application form, please email us at msf_babybonus@msf.gov.sg with screenshots of the online form."},
            {"q":"I wish to change my child's immunisation appointment, can I do so via the Moments of Life (Families) app?","a":"You can currently only view your child’s immunisation records on the Moments of Life (Families) app. Please contact the polyclinic/hospital where your child will be having the immunisation to request for a change in appointment."},
            {"q":"Why can't I make an appointment on the app to collect the Birth Certificate(s) at the hospital?","a":"The e-appointment booking feature for hospitals is currently not available on the app. E-appointment bookings via the app are only available for Birth Certificate collection at the Immigration & Checkpoints Authority (ICA)."}, 
            {"q":"My child's appointment information is not updated. What should I do?","a":"Please contact the Health Promotion Board (HPB) at hpb_healthhub@hpb.gov.sg."},
            {"q":"I registered my child's birth on the app but missed my appointment to collect my childâ€™s Birth Certificate. Can I make another appointment on the app?","a":"Please log in to Immigration & Checkpoints Authority (ICA) e-Appointment page to request for a change in date and time of your appointment."},
            {"q":"Why is my application unsuccessful?","a":"Your Baby Bonus application could be unsuccessful if: any information you have keyed in is incorrect or does not match the records in our database, or you completed the wrong section "}, 
            {"q":"I have applied for the Baby Bonus Scheme. How can I open the Child Development Account (CDA) for my child?","a":"If you, the applicant, are the CDA Trustee, your child's CDA will be automatically opened within 3 days once he or she joins the scheme."}]
            }

    tag_json = json.dumps(tag)
    tag_json = json.loads(tag_json)

    for item in updated_json["intents"]:
        for questions in tag_json['intents']:
            if (str(questions["q"]) ==  str(item["tag"]) ):
                item.update(response=questions["a"].replace('\n',''))
    
    return updated_json
    
# def checkfillresponse(intentjson):
#     tag = {"intents":
#             [{"q":"Are children of unwed parents eligible to join the Baby Bonus Scheme?","a":"Children of unwed parents are eligible to join the Baby Bonus Scheme if they are Singapore Citizens and were born on, or after 1 September 2016 to the receive CDA benefits. To check if your child is eligible for Baby Bonus, you can use the Check Eligibility on Baby Bonus Online."},
#             {"q":"My application status is Action Required by Applicant. What should I do?","a":"If you have submitted an application and the status is “Action Required By Applicant”, please check if the parent details you have keyed in to your application form are the same as those printed on your child’s birth certificate. Changes can be made by using “Update Application/Check Status” on Baby Bonus Online. If you are unable to edit your application form, please email us at msf_babybonus@msf.gov.sg with screenshots of the online form."},
#             {"q":"I wish to change my child's immunisation appointment, can I do so via the Moments of Life (Families) app?","a":"You can currently only view your child’s immunisation records on the Moments of Life (Families) app. Please contact the polyclinic/hospital where your child will be having the immunisation to request for a change in appointment."},
#             {"q":"Why can't I make an appointment on the app to collect the Birth Certificate(s) at the hospital?","a":"The e-appointment booking feature for hospitals is currently not available on the app. E-appointment bookings via the app are only available for Birth Certificate collection at the Immigration & Checkpoints Authority (ICA)."}, 
#             {"q":"My child's appointment information is not updated. What should I do?","a":"Please contact the Health Promotion Board (HPB) at hpb_healthhub@hpb.gov.sg."},
#             {"q":"I registered my child's birth on the app but missed my appointment to collect my childâ€™s Birth Certificate. Can I make another appointment on the app?","a":"Please log in to Immigration & Checkpoints Authority (ICA) e-Appointment page to request for a change in date and time of your appointment."},
#             {"q":"Why is my application unsuccessful?","a":"Your Baby Bonus application could be unsuccessful if: any information you have keyed in is incorrect or does not match the records in our database, or you completed the wrong section "}, 
#             {"q":"I have applied for the Baby Bonus Scheme. How can I open the Child Development Account (CDA) for my child?","a":"If you, the applicant, are the CDA Trustee, your child's CDA will be automatically opened within 3 days once he or she joins the scheme."}]
#             }

#     tag_json = json.dumps(tag)
#     tag_json = json.loads(tag_json)

#     for item in intentjson["intents"]:
#         for questions in tag_json['intents']:
#             if (str(questions["q"]) ==  str(item["tag"]) ):
#                 print(item)


if __name__ == "__main__":
    index = 0
    
    json_intent = {"intents":[]} 

    while index < 18:
        filename = "permutations/output_success_"+str(index)+".txt"
        tag_pattern = constructJSON(filename)
        json_intent["intents"].extend(tag_pattern)
        index+=1

    new_json_intent = insert_response(json_intent)
    updated_json_intent = fill_undefined_response(new_json_intent)

    with open('babybonusintents.json','w') as outfile:
        json.dump(updated_json_intent, outfile)
    

    
    



