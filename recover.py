import json

content = ""
with open("/Users/flo/.gemini/antigravity-ide/brain/51a859a7-67fe-46d8-90bd-e7196c9d1a72/.system_generated/logs/transcript.jsonl", "r") as f:
    for line in f:
        data = json.loads(line)
        step = data["step_index"]
        if step > 1319:
            break
        if "tool_calls" in data:
            for tc in data["tool_calls"]:
                name = tc.get("name", "")
                if name in ["write_to_file", "replace_file_content", "multi_replace_file_content"]:
                    args = tc.get("args", {})
                    if isinstance(args, str):
                        try:
                            args = json.loads(args)
                        except:
                            pass
                    target = args.get("TargetFile", "")
                    if "configurators/index.blade.php" in target:
                        if name == "write_to_file":
                            content = args.get("CodeContent", "")
                        elif name == "replace_file_content":
                            target_c = args.get("TargetContent", "")
                            repl_c = args.get("ReplacementContent", "")
                            if target_c in content:
                                content = content.replace(target_c, repl_c)
                        elif name == "multi_replace_file_content":
                            chunks = args.get("ReplacementChunks", [])
                            if isinstance(chunks, str):
                                try:
                                    chunks = json.loads(chunks)
                                except:
                                    pass
                            for chunk in chunks:
                                if isinstance(chunk, str):
                                    try:
                                        chunk = json.loads(chunk)
                                    except:
                                        pass
                                if isinstance(chunk, dict):
                                    target_c = chunk.get("TargetContent", "")
                                    repl_c = chunk.get("ReplacementContent", "")
                                    if target_c in content:
                                        content = content.replace(target_c, repl_c)

with open("/Users/flo/cms/resources/views/configurators/index.blade.php", "w") as f:
    f.write(content)
print("Recovered file to step 1319")
