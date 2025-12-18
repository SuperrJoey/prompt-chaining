import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";




async function main() {
    const llm = new ChatOpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        model: "xiaomi/mimo-v2-flash:free",
        temperature: 0.7,
        configuration:{
            baseURL: "https://openrouter.ai/api/v1"
        }
    });

    const outlinePrompt = new PromptTemplate({
        inputVariables: ["topic"],
        template: "Write a short outline for a blog post about {topic}"
    })

    const expandedPrompt = new PromptTemplate({
        inputVariables: ["outline"],
        template: "Expand the following outline into detailed explanation: {outline}"
    })

    const summaryPrompt = new PromptTemplate({
        inputVariables: ["content"],
        template: "Summarize the following expanded explanation into a concise manner, in FIVE bullet points:\n{content}"
    })

    const outlineChain = outlinePrompt.pipe(llm);
    const expandChain = expandedPrompt.pipe(llm);
    const summaryChain = summaryPrompt.pipe(llm);

    const outlineResult = await outlineChain.invoke({
        topic: "LangChain in WebDevelopment",
    });

    console.log("=======OUTLINE=======");
    console.log(outlineResult.content);

    const expandedResult = await expandChain.invoke({
        outline: outlineResult.content,
      });
    
      console.log("\n========== EXPANDED ==========");
      console.log(expandedResult.content);

      const summaryResult = await summaryChain.invoke({
        content: expandedResult.content,
      });
    
      console.log("\n========== SUMMARY ==========");
      console.log(summaryResult.content);
    
    // const chain = RunnableSequence.from([
    //     outlinePrompt,
    //     llm,
    //     (msg) => ({outline: msg.content}),
    //     expandedPrompt,
    //     llm,
    //     (msg) => ({content: msg.content}),
    //     summaryPrompt,
    //     llm,
    // ])
    
    // const result = await chain.invoke({
    //     topic: "LangChain in WebDevelopment",
    // })

    // console.log(result.content)
}

main().catch(console.error);