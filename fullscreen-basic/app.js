import $ from 'jquery';
import _ from 'lodash';
import './css/main.scss';
import './css/style.scss';
import Assets from './assets/assets';
import {getIconDimensions, escapeHtml, handleConsoleMessage} from './lib/utils';
import {FollowAnalyticsWrapper} from './lib/FollowAnalyticsWrapper';

$(window).on('load', () => {
  try {
    const FollowAnalytics = new FollowAnalyticsWrapper().FollowAnalytics;
    if (typeof FollowAnalyticsParams === 'undefined') {
      throw {severity: 'warning', message: 'Missing template parameters, shutting down.'};
    }

    let alreadyClosed = false;

    const templateContainer = $('.defaultTemplate');
    templateContainer.css({backgroundColor: FollowAnalyticsParams.background.color});

    const templateIcon = $('#templateIcon');
    const currentIcon = FollowAnalyticsParams.icon.svg;
    if (currentIcon !== 'none') {
      templateIcon.html(Assets[currentIcon]);
      const iconDimensions = getIconDimensions(FollowAnalyticsParams.icon.size);
      templateIcon.find('svg').css({
        height: iconDimensions.height,
        width: iconDimensions.width,
        color: FollowAnalyticsParams.icon.color,
        fill: FollowAnalyticsParams.icon.color,
      });
    }

    const templateTitle = $('#templateTitle');
    templateTitle.text(FollowAnalyticsParams.title.text);
    templateTitle.css({
      fontFamily: `${FollowAnalyticsParams.title.font}`,
      fontSize: `${FollowAnalyticsParams.title.size}px`,
      color: FollowAnalyticsParams.title.color,
    });

    const templateBody = $('#templateBody');
    const newlineRegex = /(?:\r\n|\r|\n)/g;
    templateBody.html(escapeHtml(FollowAnalyticsParams.body.text).replace(newlineRegex, '<br>'));
    templateBody.css({
      fontFamily: `'${FollowAnalyticsParams.body.font}'`,
      fontSize: `${FollowAnalyticsParams.body.size}px`,
      color: FollowAnalyticsParams.body.color,
    });

    const closeButtonContainer = $('#templateClose');
    closeButtonContainer.html(Assets.icoClose);
    closeButtonContainer.find('svg').css({fill: FollowAnalyticsParams.close.color});
    closeButtonContainer.on('click', () => {
      if (!alreadyClosed) {
        alreadyClosed = true;
        if (FollowAnalytics.CurrentCampaign.logAction) FollowAnalytics.CurrentCampaign.logAction('Dismiss');
        FollowAnalytics.CurrentCampaign.close();
      }
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
        if (alreadyClosed) return;
        if (FollowAnalytics.CurrentCampaign.logAction) FollowAnalytics.CurrentCampaign.logAction(faButton.text);
        if (faButton.deeplink_url !== '') {
          if (FollowAnalyticsWrapper.checkMinSdkVersion(6, 3, 0)) {
            window.location.href = faButton.deeplink_url;
          }
          else {
            const deeplinkIframe = $(`
              <iframe
                src="${faButton.deeplink_url}"
                class="defaultTemplate__deeplinkFrame"
                sandbox="allow-same-origin allow-scripts"
                frameborder="0">
              </iframe>
            `);
            deeplinkIframe.on('load', () => {
              deeplinkIframe.css({'opacity': 1});
            })
            templateContainer.append(deeplinkIframe);
          }
        }
        else {
          alreadyClosed = true;
          FollowAnalytics.CurrentCampaign.close();
        }
      });

      buttonContainerHTML.append(buttonHTML);
      templateButtons.append(buttonContainerHTML);
    });
  }
  catch (e) {
    handleConsoleMessage(e);
  }
});
