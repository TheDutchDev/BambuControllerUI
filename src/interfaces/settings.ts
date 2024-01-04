import { EState } from "@/enums/state";
import { EMode } from "@/enums/mode";

export interface ISettings {
    system : ISystemSettings;
    printer : IPrinterSettings;
    network : INetworkSettings;
}

export interface ISystemSettings {
    config : ISystemConfig;
}

export interface ISystemConfig {
    state : EState;
    mode : EMode;
}

export interface IPrinterSettings {
    config : IPrinterConfig;
    status : IPrinterStatus;
}

export interface IPrinterConfig {
    ipAddress : string;
    accessCode : string;
    serialNumber : string;
}

export interface IPrinterStatus {
    gcodeState : string;
    stage: number;
    ledState: boolean;
    online: boolean;
    finished: boolean;
}

export interface INetworkSettings {
    config : INetworkConfig;
}

export interface INetworkConfig {
    ssid: string;
    password : string;
    hostName : string;
}