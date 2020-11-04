import {
  updateEntity
} from "./main";
import { PickUpStixFlags } from "./models";

/**
 * Application class to display to select an item that the token is
 * associated with
 */
export default class ContainerImageSelectionApplication extends FormApplication {
	static get defaultOptions(): FormApplicationOptions {
    return mergeObject(super.defaultOptions, {
      closeOnSubmit: false,
      submitOnChange: true,
      id: "pick-up-stix-container-image-selection",
	    template: "modules/pick-up-stix/module/pick-up-stix/templates/container-image-selection.html",
      height: 'auto',
      width: 'auto',
		  minimizable: false,
      title: `Choose Container Images`
    });
	}

	private _html: any;

	constructor(private _token: Token) {
		super(_token);
		console.log(`pick-up-stix | ContainerImageSelectionApplication ${this.appId} | constructed with args:`)
		console.log([this._token]);
	}

	activateListeners(html) {
    console.log(`pick-up-stix | ContainerImageSelectionApplication ${this.appId} | activateListeners called with args:`);
		console.log([html]);

    this._html = html;
    super.activateListeners(this._html);

    $(html)
      .find('img')
      .css('max-width', '160px')
      .css('height', '160px')
      .first()
      .css('margin-right', '20px');

    $(html)
      .find('img')
      .on('click', this._onClickImage);

    $(html)
      .find('h2')
      .css('font-family', `"Modesto Condensed", "Palatino Linotype", serif`);
	}

	getData() {
    const data = {
      data: this._token.data
    }
    console.log(data);
    return data;
  }

  protected _onClickImage = (e) => {
    const attr = e.currentTarget.dataset.edit;
    const current = getProperty(this._token.data, `flags.pick-up-stix.pick-up-stix.${attr}`);
    new FilePicker({
      type: "image",
      current,
      callback: path => {
        e.currentTarget.src = path;
        this._onSubmit(e);
      },
      top: this.position.top + 40,
      left: this.position.left + 10
    }).browse(current);
  }

  async _updateObject(e, formData) {
    console.log(`pick-up-stix | ContainerImageSelectionApplication ${this.appId} | _updateObject`);
    console.log([e, duplicate(formData)]);

    const flags = this.object.getFlag('pick-up-stix', 'pick-up-stix');
    const { sceneId, tokenId } = flags;
    const isToken = sceneId !== undefined && tokenId !== undefined;

    if (!isToken) {
      await updateEntity(this.object, {
        'flags': {
          'pick-up-stix': {
            'pick-up-stix': {
              container: {
                ...formData
              }
            }
          }
        }
      });
    }
    else {
      // await saveLootTokenData(sceneId, tokenId, { container: { ...formData }} as PickUpStixFlags);
    }
  }
}
