//
//  AppDelegate.swift
//  lwc-test-app
//
//  Created by Kevin Hawkins on 8/26/20.
//  Copyright © 2020 Kevin Hawkins. All rights reserved.
//

import UIKit
import os

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {



    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let componentNameArgName = "componentname="
        let componentNameArg = CommandLine.arguments.filter { $0.hasPrefix(componentNameArgName) }.first
        var componentName: String
        if let componentNameArg = componentNameArg {
            componentName = String(componentNameArg.suffix(componentNameArg.count - componentNameArgName.count))
        } else {
            componentName = "<No Value>"
        }
        os_log("ComponentName: %s", componentName)
        for argString in CommandLine.arguments {
            os_log("CommandLineArguments string: %s", argString)
        }
        
        return true
    }

    // MARK: UISceneSession Lifecycle

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }


}

