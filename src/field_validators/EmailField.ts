
import { TextField } from './TextField'
import { i18n, isNullUndefEmpty } from '../utils'

/*
    Email-field
*/
import { IBaseField, IEmailField, ITextField, OmitInContructor } from '../interfaces'
import { TFieldError } from '../schema';

type TEmailField = Omit<IEmailField, 'interfaceId' | 'providedBy'>;

export class EmailField extends TextField<TEmailField> implements TEmailField {
  readonly __implements__ = [IEmailField, ITextField, IBaseField];
  minLength: number;
  maxLength: number;
  trim: boolean;
  constructor({ required, readOnly, minLength, maxLength, trim }: Omit<TEmailField, OmitInContructor>
    = { required: false, readOnly: false, minLength: undefined, maxLength: undefined, trim: false }) {
    super({required, readOnly });
    this.minLength = minLength;
    this.maxLength = maxLength;
    this.trim = trim;
  }

  async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
    let err = await super.validate(inp, options, context);
    if (err) return err;

    // Required has been checked so if it is empty it is ok
    if (isNullUndefEmpty(inp)) {
      return;
    }

    /* 
        Using a proper e-mail testing algorithm
        http://thedailywtf.com/articles/Validating_Email_Addresses
    */
    var add = inp
    var ampisthere = false
    var spacesthere = false

    var textbeforeamp = false
    var textafteramp = false
    var dotafteramp = false
    var othererror = false

    for (var i = 0; i < add.length; ++i) {
      if (add.charAt(i) == '@') {
        if (ampisthere)
          othererror = true

        ampisthere = true
      } else if (!ampisthere)
        textbeforeamp = true

      else if (add.charAt(i) == '.')
        dotafteramp = true

      else
        textafteramp = true

      if (add.charAt(i) == ' ' || add.charAt(i) == ',')
        spacesthere = true

    }

    if (spacesthere || !ampisthere || !textafteramp || !textbeforeamp || !dotafteramp || othererror) {
      err = {
        type: 'type_error',
        i18nLabel: i18n('isomorphic-schema--email_field_incorrect_formatting', 'This is not a valid e-mail address'),
        message: "Det här är inte en riktig e-postadress"
      }

      return err;
    }
  }

}
