FROM mysql:8.0

# Copy initialization scripts
COPY init/ /docker-entrypoint-initdb.d/

# Set default authentication plugin
CMD ["--default-authentication-plugin=mysql_native_password"]
