FROM python:3

run mkdir -p /api
WORKDIR /api

COPY . /api

RUN pip install -r requirements.txt

# RUN python -m nltk.downloader 'punkt'

# ENTRYPOINT ["flask"]
# CMD ["run", "--host=0.0.0.0"]
CMD ["python", "flaskApp.py"]