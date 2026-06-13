import { ChatbotSetting } from "@/globals";
import { redis } from "@/lib/redis";

export async function getAllSettings(): Promise<ChatbotSetting[]> {
    const keys = await redis.keys("calcoast:settings:*");
    if (!keys.length) return [];
    const values = await redis.mget(keys.map((key)=>key.replace("calcoast:","")));
    return keys.map((key, i) => ({
        key,
        value: values[i] ?? "",
    }));
}

// Output: KEYS: ["calcoast:settings:mail:user","calcoast:settings:password","calcoast:settings:username","calcoast:settings:transcript-recievers","calcoast:settings:mail:host","calcoast:settings:mail:password","calcoast:settings:auth:password","calcoast:settings:auth:username"] VALUES: [null,null,null,null,null,null,null,null]

export async function updateAllSettings(settings: ChatbotSetting[]) {
    if (!settings.length) return;

    const pipeline = redis.pipeline();

    settings.forEach(({ key, value }) => {
        pipeline.set(key, `${value}`);
    });

    await pipeline.exec();
    return (await getAllSettings())
}

export async function getSetting(key: string): Promise<string | null> {
    const val = await redis.get(key)
    return val;
}

