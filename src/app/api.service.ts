import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseurl = environment.apiUrl;

  constructor(private httpclient: HttpClient) { }

  // reservations

  getAllReservations(){
    return this.httpclient.get<any>(`${this.baseurl}/reservations`);
  }

  getReservationById(params: any = {}): Observable<any> {
    return this.httpclient.get<any>(`${this.baseurl}/reservations/${params.id}`);
  }

  getReservationsByRoomIdAndCustomerId(params: any = {}): Observable<any> {
    return this.httpclient.get<any>(`${this.baseurl}/reservations?roomId=${params.roomId}&customerId=${params.customerId}`);
  }

  createReservation(params: any = {}): Observable<any> {
    return this.httpclient.post<any>(`${this.baseurl}/reservations`, params);
  }

  updateReservation(params: any = {}): Observable<any> {
    return this.httpclient.put<any>(`${this.baseurl}/reservations/${params.id}`, params);
  }

  deleteReservation(params: any = {}): Observable<any> {
    return this.httpclient.delete<any>(`${this.baseurl}/reservations/${params.id}`);
  }

  getReservationServicesByReservationId(params: any = {}): Observable<any> {
    return this.httpclient.get<any>(`${this.baseurl}/reservationservices/${params.id}`);
  }

  // rooms
  
  getAllRooms(){
    return this.httpclient.get<any>(`${this.baseurl}/rooms`);
  }
  
  getRoomsByFeature(params: any = {}): Observable<any> {
    return this.httpclient.get<any>(`${this.baseurl}/rooms?featureId=${params.featureId}`);
  }

  getRoomById(params: any = {}): Observable<any> {
    return this.httpclient.get<any>(`${this.baseurl}/rooms/${params.id}`);
  }

  createRoom(params: any = {}): Observable<any> {
    return this.httpclient.post<any>(`${this.baseurl}/rooms`, params);
  }

  updateRoom(params: any = {}): Observable<any> {
    return this.httpclient.put<any>(`${this.baseurl}/rooms/${params.id}`, params);
  }

  deleteRoom(params: any = {}): Observable<any> {
    return this.httpclient.delete<any>(`${this.baseurl}/rooms/${params.id}`);
  }

  // customers

  getAllCustomers(){
    return this.httpclient.get<any>(`${this.baseurl}/customers`);
  }

  getCustomerById(params: any = {}): Observable<any> {
    return this.httpclient.get<any>(`${this.baseurl}/customers/${params.id}`);
  }

  createCustomer(params: any = {}): Observable<any> {
    return this.httpclient.post<any>(`${this.baseurl}/customers`, params);
  }

  updateCustomer(params: any = {}): Observable<any> {
    return this.httpclient.put<any>(`${this.baseurl}/customers/${params.id}`, params);
  }
  
  deleteCustomer(params: any = {}): Observable<any> {
    return this.httpclient.delete<any>(`${this.baseurl}/customers/${params.id}`);
  }

  // services

  getAllServices(){
    return this.httpclient.get<any>(`${this.baseurl}/services`);
  }

  getServiceById(params: any = {}): Observable<any> {
    return this.httpclient.get<any>(`${this.baseurl}/services/${params.id}`);
  }

  createService(params: any = {}): Observable<any> {
    return this.httpclient.post<any>(`${this.baseurl}/services`, params);
  }

  updateService(params: any = {}): Observable<any> {
    return this.httpclient.put<any>(`${this.baseurl}/services/${params.id}`, params);
  }

  deleteService(params: any = {}): Observable<any> {
    return this.httpclient.delete<any>(`${this.baseurl}/services/${params.id}`);
  }

  // features

  getAllFeatures(){
    return this.httpclient.get<any>(`${this.baseurl}/features`);
  }

  getFeatureById(params: any = {}): Observable<any> {
    return this.httpclient.get<any>(`${this.baseurl}/features/${params.id}`);
  }

  createFeature(params: any = {}): Observable<any> {
    return this.httpclient.post<any>(`${this.baseurl}/features`, params);
  }

  updateFeature(params: any = {}): Observable<any> {
    return this.httpclient.put<any>(`${this.baseurl}/features/${params.id}`, params);
  }

  deleteFeature(params: any = {}): Observable<any> {
    return this.httpclient.delete<any>(`${this.baseurl}/features/${params.id}`);
  }

  // room types

  getAllRoomTypes(){
    return this.httpclient.get<any>(`${this.baseurl}/rooms/roomtypes`);
  }
}