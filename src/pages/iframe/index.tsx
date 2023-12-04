import { memo, useEffect, useRef } from "react";
import { Server, ClientEventType, CommonEventType } from "@amax/amaxup"
import styles from "./index.module.scss";
import IdGenerator from "@/utils/IdGenerator";
import { delay } from "@/utils";

function Iframe() {
  const ref = useRef<HTMLIFrameElement>(null);
  const serverRef = useRef<any>()

  useEffect(() => {
    if (ref.current) {
      const server = new Server(ref.current);
      serverRef.current = server;
      server.addEventListener((e) => {
        console.log(e);
      });
      server.on(ClientEventType.GET_ACCOUNT, async (message) => {
        await delay(1000);
        message.type = CommonEventType.ERROR;
        message.payload = { account: "abc" }
        return message;
      })
      setTimeout(() => {
        server.login({
          name: "adb",
          publicKey: "adf",
          permission: "active"
        })
      }, 2000)

    }

  }, [])

  function send() {
    // const contentWindow = ref.current?.contentWindow;
    // if (contentWindow) {
    //   contentWindow.postMessage('父页面发送', "*");
    // }
    serverRef.current.login({
      name: "adb",
      publicKey: "adf",
      permission: "active"
    })
  }

  return (
    <div className={styles.body}>
      <button onClick={send}>发送</button>
      {/* <iframe title="title" src="http://localhost:8000/home?a" seamless={true} className={styles.iframe} ref={ref} /> */}
    </div>
  );
}

export default memo(Iframe);
