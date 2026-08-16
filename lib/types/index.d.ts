/**
 * Mascot surface plugin, node half. Mounts `GET /mascot/lines` on the host
 * webserver: each request resolves a TTL-cached batch of AI-generated idle
 * lines through the host's configured default model (`ctx.llm.stream` via
 * `ctx.agentDefaultModel.currentSelection()`). The browser half fetches this
 * route from its line rotator; failures degrade to built-in lines there.
 */
import type { Context } from '@deepseek-ai/cordis';
import type { LlmRuntime } from '@deepseek-ai/dsh-llm';
import type { WebServer } from '@deepseek-ai/dsh-host-webserver';
import type { MascotModelSelection } from './host-lines.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Registered provider/model adapters. */
        llm: LlmRuntime;
        /** HTTP route registration (the webserver plugin's face). */
        webServer: WebServer;
        /** The host's configured default model selection (structural slice of
         *  dsh-agent-default-model; see {@link MascotModelSelection}). */
        agentDefaultModel: {
            currentSelection(): MascotModelSelection;
        };
    }
}
/** Required services: the LLM runtime, the webserver, and the default model. */
export declare const inject: string[];
/** Route path the browser half fetches. */
export declare const MASCOT_LINES_PATH = "/mascot/lines";
/**
 * Host plugin body: register the lines route for the fiber's lifetime.
 * @param ctx - host Cordis context.
 */
export declare function apply(ctx: Context): void;
