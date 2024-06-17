import sre from 'speech-rule-engine';
import { DOMParser } from 'linkedom';

let mml = `<math>
        <mi>x</mi>
        <mo>=</mo>
        <mn>3</mn>
    </math>`

mml = `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
        <mi>x</mi>
        <mo>=</mo>
        <mrow data-mjx-texclass="ORD">
            <mfrac>
                <mrow>
                    <mo>&#x2212;</mo>
                    <mi>b</mi>
                    <mo>&#xB1;</mo>
                    <msqrt>
                        <msup>
                            <mi>b</mi>
                            <mn>2</mn>
                        </msup>
                        <mo>&#x2212;</mo>
                        <mn>4</mn>
                        <mi>a</mi>
                        <mi>c</mi>
                    </msqrt>
                </mrow>
                <mrow>
                    <mn>2</mn>
                    <mi>a</mi>
                </mrow>
            </mfrac>
        </mrow>
        <mo>.</mo>
    </math>`

mml = `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
        <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt">
            <mlabeledtr>
                <mtd id="mjx-eqn:18a">
                    <mtext>(18a)</mtext>
                </mtd>
                <mtd>
                    <mi>a</mi>
                </mtd>
            </mlabeledtr>
            <mlabeledtr>
                <mtd id="mjx-eqn:18b">
                    <mtext>(18b)</mtext>
                </mtd>
                <mtd>
                    <mi>b</mi>
                </mtd>
            </mlabeledtr>
        </mtable>
    </math>`


mml = `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt">
    <mtr>
      <mtd>
        <mi>g</mi>
        <mo stretchy="false">(</mo>
        <mi>z</mi>
        <mo>,</mo>
        <mi>N</mi>
        <mo stretchy="false">)</mo>
      </mtd>
      <mtd>
        <mi></mi>
        <mo>:=</mo>
        <mi>log</mi>
        <mo data-mjx-texclass="NONE">&#x2061;</mo>
        <munderover>
          <mo data-mjx-texclass="OP">&#x220F;</mo>
          <mrow data-mjx-texclass="ORD">
            <mi>j</mi>
            <mo>=</mo>
            <mn>1</mn>
          </mrow>
          <mi>N</mi>
        </munderover>
        <mfrac>
          <mn>1</mn>
          <mrow>
            <mn>1</mn>
            <mo>&#x2212;</mo>
            <msup>
              <mi>e</mi>
              <mrow data-mjx-texclass="ORD">
                <mi>z</mi>
                <mi>j</mi>
                <mrow data-mjx-texclass="ORD">
                  <mo>/</mo>
                </mrow>
                <mi>N</mi>
              </mrow>
            </msup>
          </mrow>
        </mfrac>
      </mtd>
    </mtr>
    <mtr>
      <mtd></mtd>
      <mtd>
        <mi></mi>
        <mo>=</mo>
        <mo>&#x2212;</mo>
        <munderover>
          <mo data-mjx-texclass="OP">&#x2211;</mo>
          <mrow data-mjx-texclass="ORD">
            <mi>j</mi>
            <mo>=</mo>
            <mn>1</mn>
          </mrow>
          <mi>N</mi>
        </munderover>
        <mi>log</mi>
        <mo data-mjx-texclass="NONE">&#x2061;</mo>
        <mo stretchy="false">(</mo>
        <mn>1</mn>
        <mo>&#x2212;</mo>
        <msup>
          <mi>e</mi>
          <mrow data-mjx-texclass="ORD">
            <mi>z</mi>
            <mi>j</mi>
            <mrow data-mjx-texclass="ORD">
              <mo>/</mo>
            </mrow>
            <mi>N</mi>
          </mrow>
        </msup>
        <mo stretchy="false">)</mo>
      </mtd>
    </mtr>
    <mtr>
      <mtd></mtd>
      <mtd>
        <mi></mi>
        <mo>=</mo>
        <munderover>
          <mo data-mjx-texclass="OP">&#x2211;</mo>
          <mrow data-mjx-texclass="ORD">
            <mi>j</mi>
            <mo>=</mo>
            <mn>1</mn>
          </mrow>
          <mi>N</mi>
        </munderover>
        <munderover>
          <mo data-mjx-texclass="OP">&#x2211;</mo>
          <mrow data-mjx-texclass="ORD">
            <mi>k</mi>
            <mo>=</mo>
            <mn>1</mn>
          </mrow>
          <mi mathvariant="normal">&#x221E;</mi>
        </munderover>
        <mfrac>
          <mn>1</mn>
          <mi>k</mi>
        </mfrac>
        <msup>
          <mi>e</mi>
          <mrow data-mjx-texclass="ORD">
            <mi>z</mi>
            <mi>j</mi>
            <mi>k</mi>
            <mrow data-mjx-texclass="ORD">
              <mo>/</mo>
            </mrow>
            <mi>N</mi>
          </mrow>
        </msup>
        <mo>=</mo>
        <munderover>
          <mo data-mjx-texclass="OP">&#x2211;</mo>
          <mrow data-mjx-texclass="ORD">
            <mi>k</mi>
            <mo>=</mo>
            <mn>1</mn>
          </mrow>
          <mi mathvariant="normal">&#x221E;</mi>
        </munderover>
        <mfrac>
          <mn>1</mn>
          <mi>k</mi>
        </mfrac>
        <mfrac>
          <mrow>
            <mn>1</mn>
            <mo>&#x2212;</mo>
            <msup>
              <mi>e</mi>
              <mrow data-mjx-texclass="ORD">
                <mi>k</mi>
                <mi>z</mi>
              </mrow>
            </msup>
          </mrow>
          <mrow>
            <msup>
              <mi>e</mi>
              <mrow data-mjx-texclass="ORD">
                <mo>&#x2212;</mo>
                <mi>k</mi>
                <mi>z</mi>
                <mrow data-mjx-texclass="ORD">
                  <mo>/</mo>
                </mrow>
                <mi>N</mi>
              </mrow>
            </msup>
            <mo>&#x2212;</mo>
            <mn>1</mn>
          </mrow>
        </mfrac>
        <mo>.</mo>
      </mtd>
    </mtr>
  </mtable>
</math>`

export const sreLinearizer = async (mml) => {


await sre.engineReady();
await sre.setupEngine({
    domain: 'mathspeak',
    locale: 'en',
    automark: true,
    markup: 'ssml'
});
await sre.engineReady();
const ssmlString = await sre.toSpeech(mml).toString().replace('<?xml version="1.0"?>', '');
const mmlString = await sre.toEnriched(mml).toString();


const ssmlDom = (new DOMParser).parseFromString(ssmlString, 'text/xml');

const mmlDom = (new DOMParser).parseFromString(mmlString, 'text/xml');

let ssmlChildNodes = ssmlDom.querySelector('prosody').childNodes;

let s = [];
let currentTarget = null;
let lastValidTarget = null;
ssmlChildNodes.forEach(ssmlChild => {
    // console.log(s)
    if (ssmlChild.tagName === 'mark') {
        if (ssmlChild.getAttribute('kind') === 'LAST') return
        const id = ssmlChild.getAttribute('name');
        let mmlTarget = mmlDom.querySelector(`[data-semantic-id="${id}"]`);
        const isLeaf = !mmlTarget.getAttribute('data-semantic-children');
        if (currentTarget) {
            currentTarget.setAttribute('aria-label', s.join(' '));
            currentTarget.setAttribute('tabindex', '0'); // TODO maybe do this elsewhere
            s = [];
        }
        currentTarget = isLeaf ? mmlTarget : null; // reset 
        if (isLeaf) lastValidTarget = currentTarget; // for table example
    }
    else {
        let text = ssmlChild.textContent.trim()
        if (text !== '') s.push(text);
    }
})
if (s.length > 0) {
    const dumpee = currentTarget || lastValidTarget;
    dumpee.setAttribute('aria-label', dumpee.getAttribute('aria-label')||'' + ' ' + s.join(' ')) //add remaining to last current Target?
    dumpee.setAttribute('tabindex', '0'); // TODO maybe do this elsewhere

}

const mmlNode = mmlDom.querySelector('math');

const cleanupAttributes = (node) => {
    [...node.attributes].forEach((attr) => {
        if (!attr.name.startsWith('data-')) return;
        node.removeAttribute(attr.name);
    });
};

mmlNode.querySelectorAll('*').forEach(node => cleanupAttributes(node));
console.log(mmlNode.outerHTML);
return mmlNode;
}
