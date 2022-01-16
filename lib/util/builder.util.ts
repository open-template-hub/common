/**
 * @description holds builder util
 */

import fs from 'fs';
import { DebugLogUtil } from '../util/debug-log.util';

export class BuilderUtil {
  constructor( private debugLogUtil = new DebugLogUtil() ) {
  }

  /**
   * builds template from a file
   * @param filePath file path
   * @param params parameters
   */
  buildTemplateFromFile = ( filePath: string, params?: Map<string, string> ) => {
    var template = '';

    try {
      template = fs.readFileSync( filePath, 'utf-8' );
    } catch ( err ) {
      console.error( err );
    }

    if ( params ) {
      params.forEach( ( value: string, key: string ) => {
        template = template.replace( key, value );
      } );
    }

    this.debugLogUtil.log( 'Successfully build template: ' + filePath );

    return template;
  };

  /**
   * builds url
   * @param url url
   * @param params parameters
   */
  buildUrl = ( url: string, params: Array<string> ) => {
    let generatedUrl = url;
    for ( let i = 0; i < params.length; i++ ) {
      let param = params[ i ];
      generatedUrl = generatedUrl.replace( '{{' + i + '}}', param );
    }
    return generatedUrl;
  };

  /**
   * builds template from a string
   * @param body string
   * @param params parameters
   */
  buildTemplateFromString = ( body: string, params?: Map<string, string> ) => {
    if( params ) {
      params.forEach( ( value: string, key: string ) => {
        body = body.replace( key, value );
      } );
    }

    this.debugLogUtil.log( 'Successfully build template: ' + body );

    return body;
  }
}
