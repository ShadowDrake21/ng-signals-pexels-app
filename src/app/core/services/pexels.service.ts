// angular stuff
import { Injectable } from '@angular/core';
import { createClient } from 'pexels';

// environment
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PexelsService {
  private client = createClient(environment.pexels_api_key);

  public getClient() {
    return this.client;
  }
}
