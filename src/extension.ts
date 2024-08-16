/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { window, commands, ExtensionContext, QuickPickItemKind } from 'vscode';
import * as vscode from 'vscode';

import { showQuickPick, showInputBox } from './basicInput';
import { createAuth0Child, getQlikSenseToken, getTenantID, createOauthIDPInQlikSense, createOAuthInQlikSense, MakeOauthTrusted, PublishOAuthInQlikSense, cleanOAuthURL, uploadApps, createSpace, createSpaceAssignment, publishApps, getAssistants} from './webcalls';
import { url } from 'inspector';
import * as fs from 'fs';
import * as path from 'path';
import { changeVariables, copyFile_, copyFiles_, readAndCreateDirs, readDir } from './fileCopy';
import { rejects } from 'assert';



export function activate(context: ExtensionContext) {



	const _path = vscode.workspace.workspaceFolders;

	//if(typeof _path !== 'undefined') {

	//const replaceObject:object = {};
	type replaceObject_type = { [key: string]: string };
	const replaceObject: replaceObject_type = {};
	var _pathDirect = "";
	if (_path !== undefined && _path[0] !== null) {
		_pathDirect = _path[0].uri.path;
	}

	//samples.quickInput
	context.subscriptions.push(commands.registerCommand('qlik.answers', async () => {

		if (typeof _path === 'undefined') {

			window.showInformationMessage('Please open a folder before running the extension',);


		} else {
			if (_pathDirect.startsWith("/")) { _pathDirect = _pathDirect.substring(1, _pathDirect.length); };


			let QlikSenseURL: string = '';
			let QlikSenseToken: any = '';
			let QlikSenseClientID: string = '';
			let QlikSenseClientSecret: string = '';
			

			let typeOfSenseAuth: any = '';



			
			if (QlikSenseURL === "") {
				QlikSenseURL = await showInputBox("Qlik Cloud URL in following format https://tenantName.region.qlikcloud.com", false);
			}
			
			replaceObject["<replace_URL_From_Qlik>"] = QlikSenseURL;

			

			if (typeOfSenseAuth === "") {
				typeOfSenseAuth = await showQuickPick("Will you use a developer key or Oauth client_id and secret for Qlik Sense?", ['Developer key', 'Oauth credentials']);
			}

			if (typeOfSenseAuth !== "Developer key") {
				while (QlikSenseClientID === '') {
					QlikSenseClientID = await showInputBox("Enter Qlik Sense Oauth client_id", false);

				}

				while (QlikSenseClientSecret === '') {
					QlikSenseClientSecret = await showInputBox("Enter Qlik Sense Oauth client_secret", true);

				}



				



				QlikSenseToken = await getQlikSenseToken(QlikSenseClientID, QlikSenseClientSecret, QlikSenseURL);
				QlikSenseToken = JSON.parse(QlikSenseToken).access_token;

				



			} else {

				while (QlikSenseToken === '') {
					QlikSenseToken = await showInputBox("Enter Qlik Sense developer key", true);
				}
			}


			let qlikTenantID: any = await getTenantID(QlikSenseToken, QlikSenseURL);
			let Oauth_record: any = await createOAuthInQlikSense(QlikSenseToken, QlikSenseURL);
			let Oauth_id = JSON.parse(Oauth_record).clientId;
			await MakeOauthTrusted(QlikSenseToken, QlikSenseURL,Oauth_id)
			
			replaceObject["<replace_OAUTH_clientID_From_Qlik>"] = Oauth_id;
			
			
			let Assistants:any = await getAssistants(QlikSenseToken, QlikSenseURL);
			let AssistantsLimited = [];
			let AssistantsNames:any = [];

			JSON.parse(Assistants).data.forEach(function(element:any) {
				
				AssistantsNames.push(element.name); 
				
			});



			let assistant: any = '';
			let assistantID: any = '';
			assistant = await showQuickPick("Which assistant will you integrate?", AssistantsNames);

			JSON.parse(Assistants).data.forEach(function(element:any) {
				
				if(element.name === assistant) {
					assistantID = element.id;
					replaceObject["<assistantID>"] =assistantID;
				}



			});

			//await PublishOAuthInQlikSense(QlikSenseToken, QlikSenseURL, Oauth_id);


			replaceObject["<replace_tenantURL_From_Qlik>"] = QlikSenseURL.replace('http://', '').replace('https://', '');

			await readAndCreateDirs(path.join(__dirname, '..', 'assets'), _pathDirect);
			await copyFiles_(path.join(__dirname, '..', 'assets'), _pathDirect);


			let filesToChange: string[] = ['src/assistant.html'];
			await changeVariables(filesToChange, _pathDirect, JSON.stringify(replaceObject));

			var term = vscode.window.createTerminal('Qlik');
			term.show();
			term.sendText('npm install');
			term.sendText('npm start run');

			vscode.commands.executeCommand('vscode.open', 'http://localhost:3000');


			function testForEmptyJSONValue(properties: Array<string>, JSON: any) {
				let returnVal = "";
				properties.some(r => {
					if (!JSON.hasOwnProperty(r) || JSON[r].toString().trim() === "") {
						returnVal = r + " doesn't have a valid value in config.json";
						return true;
					}
				});

				return returnVal;


			}

			function showError(error: string) {

				window.showInformationMessage(error);
				return;
				//throw new Error('cancelled');
			}

		}
	}));
} 