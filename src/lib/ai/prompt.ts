import fs from "fs";
import path from "path";

const systemPrompt = fs.readFileSync(path.join(process.cwd(), "src", "lib", "ai", "system-prompt.txt"), "utf-8");

export async function getSystemPrompt(chatId: string) {
    const system = `
        ${systemPrompt}

        ADDITIONAL INFO:
          - The active Chat ID is : ${chatId}
    `
    return system;
}