FROM python:3.12
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["bot.py"]
EXPOSE 80