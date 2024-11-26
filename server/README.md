.env file format:

```
PORT="8000"
NODE_ENV="development"
DATABASE_URL="Your Database URL"
JWT_SECRET_KEY="CareerConnectSecret"
CLIENT_URL="Client URL"

EMAIL_HOST="smtp.gmail.com"
EMAIL_SERVICE="gmail"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="Email to Send Verification Emails From"
EMAIL_PASS="Generate an app password from the above email account settings"
```

To create app password follow this guide:

https://knowledge.workspace.google.com/kb/how-to-create-app-passwords-000009237

Example:

```
PORT="8000"
NODE_ENV="development"
DATABASE_URL="mongodb+srv://Saugat2002:<dbpassword>@cluster0.lvwcl.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET_KEY="CareerConnectSecret"
CLIENT_URL="http://localhost:8081"

EMAIL_HOST="smtp.gmail.com"
EMAIL_SERVICE="gmail"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="saugatadhikari.2002@gmail.com"
EMAIL_PASS="ttku dcyp ymll tnka"
```