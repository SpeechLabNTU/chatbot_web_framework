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
        #print('file length: ', file=sys.stderr)
        #print(len(args.audiofile.read()), file=sys.stderr)
        #args.audiofile.seek(0)

        header = {"Content-Type":"audio/x-wav"}
        response = requests.post(args.uri + '?token=' + args.token,headers=header, data=args.audiofile)

        #print(response.status_code, file=sys.stderr)
        #print(response.text, file=sys.stderr)

        if (response.status_code == 200) and (response.json()['status'] == 0):
            res = response.json()
            status_code = response.status_code
            status = res['status']
            utterance = res['hypotheses'][0]['utterance']

    except Exception as e:
        print("exception: ", file=sys.stderr)
        print(e, file=sys.stderr)

    finally:
        dict1 = {}
        dict1['status_code'] = status_code if 'status_code' in locals() else -1
        dict1['status'] = status if 'status' in locals() else -1
        dict1['utterance'] = utterance if 'utterance' in locals() else ""

        print(json.dumps(dict1)) # print response from Speech Labs

if __name__ == "__main__":
    main()