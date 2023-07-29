import { Body, Controller, Get } from "@nestjs/common";
import { ExtractRequest } from "src/models/app.model";
import { OpenaiService } from "src/services/openai/openai.service";

@Controller("openai")
export class OpenaiController {
  constructor(private openaiService: OpenaiService) {}

  @Get()
  async extractPlan(@Body() body: ExtractRequest) {
    return await this.openaiService.extractPlanFromText(body.text);
  }
}
