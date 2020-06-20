FROM python:3.6-slim

# run mkdir -p /api # no need this, WORKDIR will check and create if not exist
WORKDIR /api

# COPY . /api # no need this as we already "cd" into the WORKDIR
COPY . .

RUN apt-get clean && apt-get -y update

RUN apt-get -y install python3-dev build-essential

RUN pip install -r requirements.txt

RUN python -c "import nltk; nltk.download('stopwords'); nltk.download('punkt')"

EXPOSE 5000

CMD ["python", "flaskApp.py"]
