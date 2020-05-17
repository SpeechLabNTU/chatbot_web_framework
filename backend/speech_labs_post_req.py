import argparse
import sys
import requests
import json

def main():

    parser = argparse.ArgumentParser(description="Command line client for POST to Speech Labs")
    parser.add_argument('-u','--uri', dest='uri', help='Server HTTP URI')
    parser.add_argument('-t', '--token', dest='token',  help='User token')
    parser.add_argument('audiofile', help="Audio file to be sent to the server", type=argparse.FileType('rb'), default=sys.stdin)
    args = parser.parse_args()

    try:
        print('file length: ', file=sys.stderr)
        print(len(args.audiofile.read()), file=sys.stderr)
        args.audiofile.seek(0)
        header = {"Content-Type":"audio/x-wav"}

        if (args.audiofile.name.endswith('.wav')):
            response = requests.post(args.uri + '?token=' + args.token,headers=header, data=args.audiofile)
        elif (args.audiofile.name.endswith('.mp3')):
            response = requests.post(args.uri + '?token=' + args.token,data=args.audiofile)

        print("request headers: ", file=sys.stderr)
        print(response.request.headers, file=sys.stderr)
        print("status code: ", file=sys.stderr)
        print(response.status_code, file=sys.stderr)
        print("text: ", file=sys.stderr)
        print(response.text, file=sys.stderr)

        status = -1
        utterance = ""

        if (response.status_code == 200) and (response.json()['status'] == 0):
            res = response.json()
            status = res['status']
            utterance = res['hypotheses'][0]['utterance']
        
        dict1 = {}
        dict1['status_code'] = response.status_code
        dict1['status'] = status
        dict1['utterance'] = utterance

        print(json.dumps(dict1)) # print response from Speech Labs

    except Exception as e:
        print("exception: ", file=sys.stderr)
        print(e, file=sys.stderr)

if __name__ == "__main__":
    main()