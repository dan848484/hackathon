import { Injectable } from "@nestjs/common";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { config } from "dotenv";
import { OpenaiMessage } from "src/models/app.model";
config();

@Injectable()
export class OpenaiService {
  endpoint: string = "";
  azureApiKey: string = "";
  readonly scheduleDefaultPrompt = [
    {
      role: "system",
      content: `
		あなたにはある自然言語を解析してChatGptResponse型にそくしたJSONデータを作成してもらいたいです。社内のチャットでのコミュニケーションを想定しています。あるチャットのテキストを提示するのでそのテキストからミーティングを作成(create_meeting)または、ミーティングのキャンセル(cancel)をしているのか検知してください。
	operationはcreate_meetingまたはcancelが入ります。
	year,month,day,hour,minutesはわかる範囲で書いてください。	
	以下が作ってもらいたいJSONの型です。JSONのみ出力してください。他の情報は入りません。ただ、全くミーティングに関係ない場合はnullと出力してください。
	year,month,day,hour,minutesの中でnullになるものは現在の日付として埋めてください。現在の日付${new Date().toISOString()}
	interface ChatGptResponse{
		operation:'create_meeting' | 'cancel';
		year:number,
		month:number,
		day:number,
		hour:number,
		minutes:number
	}
		`,
    },
  ];

  constructor() {
    this.endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
    this.azureApiKey = process.env["AZURE_OPENAI_KEY"]!;
  }

  async extractPlanFromText(text: string): Promise<OpenaiMessage | undefined> {
    try {
      const client = new OpenAIClient(
        this.endpoint,
        new AzureKeyCredential(this.azureApiKey)
      );
      const deploymentId = "testbot";
      console.log("Azure Open AIのAPIコールを行います。");
      const result = await client.getChatCompletions(deploymentId, [
        ...this.scheduleDefaultPrompt,
        {
          role: "user",
          content: `こちらが解析してもらいたいテキストです。「${text}」`,
        },
      ]);
      let json = "";
      for (const choice of result.choices) {
        json = choice.message?.content;
      }
      const parsedObject = JSON.parse(json) as OpenaiMessage;
      const today = new Date();
      parsedObject.year = parsedObject.year ?? today.getFullYear();
      parsedObject.month = parsedObject.month ?? today.getMonth() + 1;
      parsedObject.day = parsedObject.day ?? today.getDate();
      parsedObject.hour = parsedObject.hour ?? today.getHours();
      parsedObject.minutes = parsedObject.minutes ?? today.getMinutes();
      return parsedObject;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
