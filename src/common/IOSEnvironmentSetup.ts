import * as reqs from './Requirements';
import { XcodeUtils } from './IOSUtils';
import { Logger } from '@salesforce/core';
import util from 'util';
import childProcess from 'child_process';
import * as iOSConfig from '../config/iosconfig.json';
const exec = util.promisify(childProcess.exec);

export class IOSEnvironmentSetup extends reqs.BaseSetup {
    constructor(logger: Logger) {
        super(logger);
        super.requirements = [
            {
                title: 'macOS Environment',
                checkFunction: this.isSupportedEnvironment,
                fulfilledMessage: 'Running macOS',
                unfulfilledMessage:
                    'You must be running macOS to install an iOS development environment',
                logger: logger   
            },
            {
                title: 'Xcode Installed',
                checkFunction: this.isXcodeInstalled,
                fulfilledMessage: 'Xcode is installed',
                unfulfilledMessage:
                    'You must install Xcode from the Mac App Store to get access to the mobile simulators.',
                logger: logger  
            },
            {
                title: 'Supported Simulator Runtime',
                checkFunction: this.hasSupportedSimulatorRuntime,
                fulfilledMessage:
                    'Environment has a supported simulator runtime',
                unfulfilledMessage: 'Your version of Xcode is not supported.',
                logger: logger  
            }
        ];
    }

    static executeCommand(command: string): Promise<{stdout: string, stderr: string}> {
        return XcodeUtils.executeCommand(command);
    }

    async isSupportedEnvironment(): Promise<string> {
        const unameCommand: string = '/usr/bin/uname';
        try {
            this.logger.info('Executing a check for supported environment');
            const { stdout } = await IOSEnvironmentSetup.executeCommand(unameCommand);
            const unameOutput = stdout.trim();
            if (unameOutput === 'Darwin') {
                return new Promise<string>((resolve, reject) =>
                    resolve('macOS detected.')
                );
            } else {
                return new Promise<string>((resolve, reject) =>
                    reject(
                        `'${unameOutput}' is not macOS, and is not supported for iOS development.`
                    )
                );
            }
        } catch (unameError) {
            return new Promise<string>((resolve, reject) =>
                reject(
                    `The command '${unameCommand}' failed: ${unameError}, error code: ${unameError.code}`
                )
            );
        }
    }

    async isXcodeInstalled(): Promise<string> {
        const xcodeSelectCommand: string = '/usr/bin/xcode-select -p';
        try {
            this.logger.info('Executing a check for Xcode environment');
            const { stdout, stderr } = await IOSEnvironmentSetup.executeCommand(xcodeSelectCommand);
            if (stdout) {
                const developmentLibraryPath = `${stdout}`.trim();
                return new Promise<string>((resolve, reject) =>
                    resolve(
                        `Xcode installed.  Configured development library path: ${developmentLibraryPath}`
                    )
                );
            } else {
                return new Promise<string>((resolve, reject) =>
                    reject(
                        `Did not receive expected output from xcode-select.  Error output: ${stderr ||
                            'None'}`
                    )
                );
            }
        } catch (xcodeSelectError) {
            return new Promise<string>((resolve, reject) =>
                reject(
                    `Xcode is not installed: ${xcodeSelectError}, error code: ${xcodeSelectError.code}`
                )
            );
        }
    }

    async hasSupportedSimulatorRuntime(): Promise<string> {
        try {
            this.logger.info('Executing a check for iOS runtimes');
            const configuredRuntimes = await XcodeUtils.getSimulatorRuntimes();
            const supportedRuntimes: Array<string> =
            iOSConfig.supportedRuntimes;
            let rtIntersection = supportedRuntimes.filter(supportedRuntime => {
                const responsiveRuntime = configuredRuntimes.find(
                    configuredRuntime =>
                        configuredRuntime.startsWith(supportedRuntime)
                );
                return responsiveRuntime !== undefined;
            });
            if (rtIntersection.length > 0) {
                return new Promise<string>((resolve, reject) =>
                    resolve(
                        `One or more supported simulator runtimes are configured for ${rtIntersection}.`
                    )
                );
            } else {
                return new Promise<string>((resolve, reject) =>
                    reject(
                        `No supported simulator runtimes found.  Supported runtimes include ${supportedRuntimes}.`
                    )
                );
            }
        } catch (supportedRuntimesError) {
            return new Promise<string>((resolve, reject) =>
                reject(
                    `Error retrieving supported runtimes: ${supportedRuntimesError}`
                )
            );
        }
    }
}

// Test!
// let envSetup = new IOSEnvironmentSetup();
// envSetup.executeSetup();
