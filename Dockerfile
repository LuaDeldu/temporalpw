# Official Python runtime, used as the parent image
FROM python:3.9-slim

# Set user variable
ARG user_name="temporalpw"

# Set correct french timezone
ENV TZ=Europe/Paris

# Set the working directory in the container to c/app
WORKDIR /app

# Add the current directory to the container as /app
COPY . /app

# Update and install everything you need
RUN pip3.9 install -r requirements.txt --upgrade && \
		groupadd -r ${user_name} && useradd -r -g ${user_name} ${user_name} && \
		chown -R ${user_name} /app && \
		chmod -R 755 /app && \
		chmod +x start.sh && \
		rm Dockerfile

# Switch to non-root-user
USER ${user_name}

# Unblock port 8080 for the Bottle app / WSGI HTTP server to run on
EXPOSE 8080

# Run the command on container startup
CMD [ "./start.sh" ]
