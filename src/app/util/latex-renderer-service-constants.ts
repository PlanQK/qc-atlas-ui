import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LatexRendererServiceConstants {
  latexFormatIndicator = '*LaTeX-packets*';
  public getDefaultLatexPackages(): string[] {
    return [
      '\\usepackage{tikz}',
      '\\usetikzlibrary{quantikz}',
      '\\usepackage{adjustbox}',
    ];
  }

  public getdefaultvarWidth(): number {
    return 1.0;
  }

  public getDefaultRenderOutput(): string {
    return 'svg';
  }

  public packTextAndPackages(text = '', packages: string): string {
    return text.concat(this.latexFormatIndicator.concat(packages));
  }

  unpackTextAndPackages(
    packedData = ''
  ): {
    latexContent: string;
    latexPackages: string;
    varwidth: number;
  } {
    let content = '';
    const packages: string[] = [];
    if (packedData) {
      const splitData = packedData.split(this.latexFormatIndicator);
      content = splitData[0];
      for (let i = 1; i < splitData.length; i++) {
        packages.push(splitData[i]);
      }
    }
    return {
      latexContent: content,
      latexPackages: packages.join(''),
      varwidth: this.getdefaultvarWidth(),
    };
  }

  public formatLatexPackagesToArray(packages: string): string[] {
    const removeBlanks = packages.split(' ');
    const removeCommas = removeBlanks.join(',').split(',');
    const removeNewLines = removeCommas.join('\n').split('\n');
    return removeNewLines.filter((el) => el !== '');
  }

  public formatLatexContent(latexContent: string): string {
    let latexRenderText = '';
    latexRenderText = latexContent.split('\\n').join('\n');
    latexRenderText = latexRenderText.split('\\t').join('\t');
    latexRenderText = latexRenderText.split('\\r').join('\r');
    return latexRenderText;
  }

  public createBlobFromRenderedResult(renderedData: any): Blob {
    return new Blob([renderedData], {
      type: renderedData.type,
    });
  }

  // TODO: This Block works and could be used to persist the already rendered Blob element as a Data URI in the backend!
  // For performance reasons, there might be need to persist the rendered pdf
  // At the moment, only the LaTeX source code and packages are persisted in the backend

  // If multiple render requests get issued simultaniously, the first received result gets used by all
  // subscribe methods. There is no way to distiguish responses from each other

  // public getBlobFromDataUri(dataURI: string): Blob {
  //   // convert base64 to raw binary data held in a string
  //   // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  //   const byteString = atob(dataURI.split(',')[1]);
  //
  //   // separate out the mime component
  //   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  //
  //   // write the bytes of the string to an ArrayBuffer
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);
  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //
  //   // write the ArrayBuffer to a blob
  //   return new Blob([ab], { type: mimeString });
  // }
  //
  // public getDataUriFromBlob(blob: Blob): string {
  //   const fileReader = new FileReader();
  //   fileReader.readAsDataURL(blob);
  //   let dataUri: string;
  //   fileReader.onload = () => {
  //     dataUri = fileReader.result.toString();
  //   };
  //   return dataUri;
  // }
}
