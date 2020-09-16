/// <reference types="node" />
import {Server} from "node-ipc";

/**
 * Starts the ipc server
 */
export function start() : void;

/**
 * Stops the ipc server
 */
export function stop(): void;

export const server: Server;