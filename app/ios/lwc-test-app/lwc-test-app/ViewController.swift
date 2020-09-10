//
//  ViewController.swift
//  lwc-test-app
//
//  Created by Kevin Hawkins on 8/26/20.
//  Copyright © 2020 Kevin Hawkins. All rights reserved.
//

import UIKit
import WebKit
import os

class ViewController: UIViewController, WKNavigationDelegate {
    
    //MARK: Properties
    @IBOutlet weak var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        webView.navigationDelegate = self
    }
    
    override func viewDidAppear(_ animated: Bool) {
//        let html = "<html><body><p>Here is a very long line of text to see what it looks like to view this in different sized containers, so I can test autolayout constraints and make sure I'm not making a mess of all of the possibilities for simply laying out a web view since I don't do this stuff anymore.</p></body></html>"
//        webView.loadHTMLString(html, baseURL: nil)
//        let urlString = "https://www.google.com/"
        let componentName = getComponentName()
        let urlString = "http://localhost:3333/lwc/preview/c/\(componentName)"
        webView.load(URLRequest(url: URL(string: urlString)!))
        os_log("LoadedUrl %s", urlString)
    }
    
    func getComponentName() -> String {
        let componentNameArgName = "componentname="
        let componentNameArg = CommandLine.arguments.filter { $0.hasPrefix(componentNameArgName) }.first
        var componentName: String
        if let componentNameArg = componentNameArg {
            componentName = String(componentNameArg.suffix(componentNameArg.count - componentNameArgName.count))
        } else {
            componentName = ""
        }
        os_log("VC ComponentName: %s", componentName)
        return componentName
    }
    
    //MARK: WKNavigationDelegate
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("didStartProvisionalNavigation")
    }
    
    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        print("didCommit")
    }
    
    func webView(_ webView: WKWebView, didReceiveServerRedirectForProvisionalNavigation navigation: WKNavigation!) {
        print("didReceiveServerRedirectForProvisionalNavigation")
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("didFail navigation")
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        print("didFailProvisionalNavigation: \(error)")
    }
}

