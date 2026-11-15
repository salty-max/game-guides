import { handle } from "../../src/app";
import { depsFromEnv } from "../../src/deps";

export default { fetch: (request: Request) => handle(request, depsFromEnv()) };
