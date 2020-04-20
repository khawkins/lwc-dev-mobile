import Ajv from 'ajv';
import availableDevicesSchema from './schemas/xcodeAvailableDevices.schema.json';
import availableRuntimesSchema from './schemas/xcodeAvailableRuntimes.schema.json';

export class SimulatorDevice {
    public name: string;
    public udid: string;
    public state: string;
    public isAvailable: boolean;
    public runtime: string;
    constructor(
        name: string,
        udid: string,
        state: string,
        isAvailable: boolean,
        runtime: string
    ) {
        this.name = name;
        this.udid = udid;
        this.state = state;
        this.isAvailable = isAvailable;
        this.runtime = runtime;
    }
}

export class SimulatorRuntime {
    public name: string;
    public version: string;
    public bundlePath: string;
    public isAvailable: boolean;
    public identifier: string;
    public buildVersion: string;
    constructor(
        name: string,
        version: string,
        bundlePath: string,
        isAvailable: boolean,
        identifier: string,
        buildVersion: string
    ) {
        this.name = name;
        this.version = version;
        this.bundlePath = bundlePath;
        this.isAvailable = isAvailable;
        this.identifier = identifier;
        this.buildVersion = buildVersion;
    }
}

export class SimulatorDeviceList {
    public simulatorDeviceList: SimulatorDevice[];

    constructor(simulatorDeviceList: SimulatorDevice[]) {
        this.simulatorDeviceList = simulatorDeviceList;
    }

    public static deviceListFromSimCtlData(
        simCtlData: any
    ): SimulatorDeviceList {
        validateSimCtlData(availableDevicesSchema, simCtlData);
        let devices: SimulatorDevice[] = [];
        const devicesRoot = simCtlData['devices'];
        for (const runtime in devicesRoot) {
            for (const deviceData of devicesRoot[runtime]) {
                devices.push(
                    new SimulatorDevice(
                        deviceData['name'],
                        deviceData['udid'],
                        deviceData['state'],
                        deviceData['isAvailable'],
                        runtime
                    )
                );
            }
        }
        return new SimulatorDeviceList(devices);
    }
}

export class SimulatorRuntimeList {
    public simulatorRuntimeList: SimulatorRuntime[];

    constructor(simulatorRuntimeList: SimulatorRuntime[]) {
        this.simulatorRuntimeList = simulatorRuntimeList;
    }

    public static runtimeListFromSimCtlData(
        simCtlData: any
    ): SimulatorRuntimeList {
        validateSimCtlData(availableRuntimesSchema, simCtlData);
        let runtimes: SimulatorRuntime[] = [];
        const runtimesArray = simCtlData['runtimes'];
        for (const runtime of runtimesArray) {
            runtimes.push(
                new SimulatorRuntime(
                    runtime['name'],
                    runtime['version'],
                    runtime['bundlePath'],
                    runtime['isAvailable'],
                    runtime['identifier'],
                    runtime['buildversion']
                )
            );
        }
        return new SimulatorRuntimeList(runtimes);
    }
}

function validateSimCtlData(schema: any, data: any) {
    const schemaValidator = new Ajv();
    const validSchema = schemaValidator.validate(schema, data);
    if (!validSchema) {
        // NB: We need a better error message.
        const validationError = JSON.stringify(schemaValidator.errors);
        throw new Error(`Data validation failed: ${validationError}`);
    }
}
