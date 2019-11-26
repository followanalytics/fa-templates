import $ from 'jquery';
import _ from 'lodash';
import './css/main.scss';
import './css/style.scss';
import Assets from './assets/assets';
import {escapeHtml, checkSDKVersion} from './lib/utils';

(function () {
  const templateContainer = $('.defaultTemplate__info');
  if (FollowAnalyticsParams.background.image !== null) {
    templateContainer.css({
      backgroundImage: `url(${FollowAnalyticsParams.background.image})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    });
  }
  else templateContainer.css({backgroundColor: FollowAnalyticsParams.background.color});

  if (FollowAnalyticsParams.image.upload !== null) {
    const imageContainer = $('#uploadedImage');
    imageContainer.css({
      backgroundImage: `url(${FollowAnalyticsParams.image.upload})`,
      display: 'flex',
    });
  }
  else {
    templateContainer.css({
      borderRadius: '10px',
      flex: '1 1 100%',
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
    if (FollowAnalytics.CurrentCampaign.logAction) FollowAnalytics.CurrentCampaign.logAction('Dismiss');
    FollowAnalytics.CurrentCampaign.close();
    $('#popupTemplate').removeClass('.backdrop');
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
        if (FollowAnalytics.getSDKVersion
          && typeof FollowAnalytics.getSDKVersion === 'function'
          && checkSDKVersion(FollowAnalytics.getSDKVersion(), 6, 3, 0)) {
          window.location.href = faButton.deeplink_url;
        }
        else {
          const deeplinkIframe = $(`
            <iframe
              src="${faButton.deeplink_url}"
              class="deeplinkFrame"
              sandbox="allow-same-origin allow-scripts"
              frameborder="0">
            </iframe>
          `);
          deeplinkIframe.on('load', () => {
            deeplinkIframe.css({'opacity': 1});
            $('#popupTemplate').prepend(closeButtonContainer);
          });
          $('#popupTemplate').prepend(deeplinkIframe);
        }
      }
      else {
        FollowAnalytics.CurrentCampaign.close();
        $('#popupTemplate').removeClass('.backdrop');
      }
    });

    buttonContainerHTML.append(buttonHTML);
    templateButtons.append(buttonContainerHTML);
  });
})();
