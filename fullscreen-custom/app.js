import $ from 'jquery';
import _ from 'lodash';
import './css/style.scss';
import './css/main.scss';
import Assets from './assets/assets';
import {escapeHtml, handleConsoleMessage} from './lib/utils';
import {FollowAnalyticsWrapper as FA} from './lib/FollowAnalyticsWrapper';

try {
  const FollowAnalytics = new FA().getApi();
  if (typeof FollowAnalyticsParams === 'undefined') {
    throw {severity: 'warning', message: 'Missing template parameters, shutting down.'};
  }

  const customTemplateContainer = $('.customTemplateContainer');
  if (FollowAnalyticsParams.background.image !== null) {
    customTemplateContainer.css({
      backgroundImage: `url(${FollowAnalyticsParams.background.image})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    });
  }
  else customTemplateContainer.css({backgroundColor: FollowAnalyticsParams.background.color});

  const templateTitle = $('#templateTitle');
  templateTitle.text(FollowAnalyticsParams.title.text);
  templateTitle.css({
    color: FollowAnalyticsParams.title.color,
    fontFamily: `'${FollowAnalyticsParams.title.font}`,
    fontSize: `${FollowAnalyticsParams.title.size}px`,
  });

  const templateBody = $('#templateBody');
  const newlineRegex = /(?:\r\n|\r|\n)/g;
  templateBody.html(escapeHtml(FollowAnalyticsParams.body.text).replace(newlineRegex, '<br>'));
  templateBody.css({
    fontFamily: `'${FollowAnalyticsParams.body.font}'`,
    fontSize: `${FollowAnalyticsParams.body.size}px`,
    color: FollowAnalyticsParams.body.color,
  });

  if (FollowAnalyticsParams.image.upload !== null) {
    const imageContainer = $('#uploadedImage');
    imageContainer.css({
      backgroundImage: `url(${FollowAnalyticsParams.image.upload})`,
      display: 'flex',
    });
  }
  else {
    const titleContainer = $('.defaultTemplate__title');
    titleContainer.css('marginTop', 'auto');
  }

  const closeButtonContainer = $('#templateClose');
  closeButtonContainer.html(Assets.icoClose);
  closeButtonContainer.find('svg').css({fill: FollowAnalyticsParams.close.color});
  closeButtonContainer.on('click', () => {
    if (FollowAnalytics.CurrentCampaign.logAction) FollowAnalytics.CurrentCampaign.logAction('Dismiss');
    FollowAnalytics.CurrentCampaign.close();
  });

  const templateButtons = $('#templateButtons');
  templateButtons.html('');
  const buttonsCount = FollowAnalyticsParams.buttons.length;
  if (buttonsCount === 2) {
    // Only when there are 2 buttons, we want them to keep the size of a full button
    // otherwise, we just stack the buttons in 1 column
    templateButtons.removeClass('buttonGrid--full');
    templateButtons.addClass('buttonGrid--withMargins');
  }

  _(FollowAnalyticsParams.buttons).forEach((faButton) => {
    const buttonContainerHTML = $('<div></div>');
    buttonContainerHTML.addClass('buttonCell');

    const buttonHTML = $(`<div>${faButton.text}</div>`);
    buttonHTML.addClass('actionButton');
    buttonHTML.css({
      backgroundColor: faButton.background,
      color: faButton.font_color,
      fontFamily: `'${faButton.font_family}'`,
      fontSize: `${faButton.font_size}px`,
    });

    buttonHTML.on('click', (_event) => {
      if (FollowAnalytics.CurrentCampaign.logAction) FollowAnalytics.CurrentCampaign.logAction(faButton.text);
      if (faButton.deeplink_url !== '') {
        if (typeof FollowAnalytics.getSDKVersion === 'function' && FA.checkMinSdkVersion(6, 3, 0)) {
          window.location.href = faButton.deeplink_url;
        }
        else {
          const deeplinkIframe = $(`
            <iframe
              src="${faButton.deeplink_url}"
              class="customTemplateContainer__deeplinkFrame"
              sandbox="allow-same-origin allow-scripts"
              frameborder="0">
            </iframe>
          `);
          deeplinkIframe.on('load', () => {
            deeplinkIframe.css({'opacity': 1});
          })
          customTemplateContainer.append(deeplinkIframe);
        }
      }
      else FollowAnalytics.CurrentCampaign.close();
    });

    buttonContainerHTML.append(buttonHTML);
    templateButtons.append(buttonContainerHTML);
  });
}
catch (e) {
  handleConsoleMessage(e);
}
