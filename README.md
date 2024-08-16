# Get started with Qlik Answers integration

This extension will configure OAuth2 M2M Impersonation on an existing Qlik tenant using the tenant URL and Client Id and Client Secret from myqlik (https://account.myqlik.qlik.com/account) or a developer key from the tenant.

![images/integration.jpg](https://raw.githubusercontent.com/jacobvinzent/Qlik_Answers_integration/main/images/integration.jpg)

## Features
This extension creates following:
1. An Oauth-client in your Qlik cloud tenant
2. An a small node js express web app with integration to an assistant

## Requirements

1. An activated Qlik Cloud tenant, with a dev token OR Oauth client Id and Secret from myqlik.
2. Qlik Answers enabled on the tenant
3. At least on assistant created in the tenant
3. Node.js installed 


## Run the extension
To run the extension, select "Setup Setup Qlik Answers integration" from the Command Palette. If everything runs successfully you can now see the webpage on http://localhost:3000


