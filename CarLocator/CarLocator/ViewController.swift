//
//  ViewController.swift
//  CarLocator
//
//  Created by Ethan Tanen on 1/19/18.
//  Copyright © 2018 Ethan Tanen. All rights reserved.
//

import UIKit
import MapKit
import CoreLocation

class ViewController: UIViewController, MKMapViewDelegate, CLLocationManagerDelegate{
    
    @IBOutlet weak var button: UIButton!
    @IBOutlet weak var map: MKMapView!
    @IBOutlet weak var mapTypeBar: UISegmentedControl!
    @IBOutlet weak var parkedButton: UIButton!
    
    var locationManager = CLLocationManager()
    var pin = MKPointAnnotation()
    var camera = MKMapCamera()
    var isParked = Bool()
    

    override func viewDidLoad() {
        
        super.viewDidLoad()
        
        //Setup an indicator to determine if the car is currently parked
        isParked = false
        
        //Setup map type bar
        mapTypeBar.layer.cornerRadius = 5
        
        //Setup camera
        camera.centerCoordinate.latitude = 0
        camera.centerCoordinate.longitude = 0
        camera.altitude = 8848
        
        
        //Setup map
        map.camera = camera
        map.mapType = .standard
        map.layer.cornerRadius = 10
       
        
        //Begin location services
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
        
        //Style remainder of storyboard
        button.layer.cornerRadius = 100
        parkedButton.layer.cornerRadius = 100
        parkedButton.isHidden = true
        
      
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    //Triggered when Park button is pressed
    @IBAction func parkCar(_ sender: UIButton) {
        
        print(sender.titleLabel?.text)
        
        //Should make transition to parked mode
        locationManager.stopUpdatingLocation()
        
        //Switch color and button label
        parkedButton.isHidden = false
        button.isHidden = true;
        parkedModeAnimation()
        
        //Car is now in park
        isParked = true
        
        print("CAR HAS BEEN PARKED")

        
    }
    
    
    //Triggered when Parked button is Pressed
    @IBAction func unparkCar(_ sender: UIButton) {
        
        print(sender.titleLabel?.text)
        print("CAR HAS BEEN UNPARKED")
        
        //Should make transtiion to not parked mode
        locationManager.startUpdatingLocation()
        
        parkedButton.isHidden = true;
        button.isHidden = false;
        parkModeAnimation()
        
        isParked = false
    }
    
        
        
    
    //Triggered whenever there is an update in the users location
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        
        //Get users location
        let loc = manager.location
        let coords = loc?.coordinate
        
        //Create pin annotation and add the pin to the map
        pin.coordinate = coords!
        map.addAnnotation(pin)
        
        //Update camera position and add the camera to the map
        map.camera.centerCoordinate = coords!

    }
    
    func parkedModeAnimation() {
        
        button.center.y += 500;
        
        UIView.animate(withDuration: 4, delay: 0, usingSpringWithDamping: 1, initialSpringVelocity: 1, options: .curveEaseOut, animations: ({
            self.button.center.y = self.button.center.y - 500
            }), completion: nil)
        
    }
    
    func parkModeAnimation() {
        
        parkedButton.center.y -= 500

        UIView.animate(withDuration: 4, delay: 0, usingSpringWithDamping: 1, initialSpringVelocity: 1, options: .curveEaseOut, animations: ({
            self.parkedButton.center.y =  self.parkedButton.center.y + 500
        }), completion: nil)
        
    }
    
    //Triggered when user switches map type
    @IBAction func mapTypeChanged(_ sender: UISegmentedControl) {
        switch sender.selectedSegmentIndex {
        case 0:
            map.mapType = .standard
        case 1:
            map.mapType = .satellite
        default:
            map.mapType = .standard
        }
    }
}

