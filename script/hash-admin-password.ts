import { hashPassword } from "../server/security";

function readHidden(prompt: string): Promise<string> {
  if (!process.stdin.isTTY) {
    return Promise.reject(new Error("보안을 위해 대화형 터미널에서 숨김 입력으로 실행해 주세요."));
  }

  return new Promise((resolve, reject) => {
    let value = "";
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    const finish = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener("data", onData);
      process.stdout.write("\n");
      resolve(value);
    };
    const onData = (character: string) => {
      if (character === "\u0003") {
        process.stdin.setRawMode(false);
        process.stdout.write("\n");
        reject(new Error("Cancelled"));
        return;
      }
      if (character === "\r" || character === "\n") return finish();
      if (character === "\u007f" || character === "\b") {
        if (value.length) {
          value = value.slice(0, -1);
          process.stdout.write("\b \b");
        }
        return;
      }
      value += character;
      process.stdout.write("*");
    };

    process.stdin.on("data", onData);
  });
}

try {
  const password = await readHidden("새 관리자 비밀번호: ");
  if (password.length < 10 || password.length > 128) {
    throw new Error("비밀번호는 10자 이상 128자 이하여야 합니다.");
  }
  const confirmation = await readHidden("비밀번호 확인: ");
  if (password !== confirmation) throw new Error("비밀번호가 일치하지 않습니다.");
  console.log(await hashPassword(password));
} catch (error) {
  console.error(error instanceof Error ? error.message : "비밀번호 해시 생성에 실패했습니다.");
  process.exitCode = 1;
}
