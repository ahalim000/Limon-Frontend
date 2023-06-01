import { useState } from "react";
import { getRecipeClient } from "@/utils";
import Cookies from "js-cookie";

import { useRouter } from "next/router";

export default function Login() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    let router = useRouter();

    let onSubmit = async (event) => {
        event.preventDefault();
        let client = getRecipeClient();
        let resp = await client.token.createToken({
            formData: {
                username: username,
                password: password,
            },
        });
        Cookies.set("session-token", resp["access_token"]);
        router.push("/");
    };

    return (
        <div>
            <form onSubmit={(event) => onSubmit(event)}>
                <label>
                    <b>Username</b>
                </label>
                <input
                    type="text"
                    placeholder="Enter Username"
                    required
                    onChange={(event) => setUsername(event.target.value)}
                ></input>
                <br></br>
                <label>
                    <b>Password</b>
                </label>
                <input
                    type="password"
                    placeholder="Enter Password"
                    required
                    onChange={(event) => setPassword(event.target.value)}
                ></input>
                <br></br>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
