import $ from 'jquery';
import _ from 'lodash';
import './css/main.scss';
import './css/style.scss';
import Assets from './assets/assets';
import {escapeHtml, handleConsoleMessage} from './lib/utils';
import {FollowAnalyticsWrapper} from './lib/FollowAnalyticsWrapper';

let alreadyClosed = false;

$(window).on('load', () => {
  try {
    const FollowAnalytics = new FollowAnalyticsWrapper().FollowAnalytics;
    if (typeof FollowAnalyticsParams === 'undefined') {
      throw {severity: 'warning', message: 'Missing template parameters, shutting down.'};
    }

    const containerBackground = $('.containerBackground');
    const defaultTemplate = $('.defaultTemplate');
    defaultTemplate.css({ backgroundColor: FollowAnalyticsParams.background.color });
    if (FollowAnalyticsParams.background.image !== null) {
      containerBackground.css({
        backgroundImage: `url(${FollowAnalyticsParams.background.image})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
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
    const video = $(`<video width='100%' height='auto' position='absolute'
                        id='templateVideo'
                        autoplay muted playsinline webkit-playsinline
                        poster=${FollowAnalyticsParams.body.topImage || ''}
                        >`);
    video.appendTo(templateBody);
    if (FollowAnalyticsParams.body.video !== null) {
      const source = $(`<source src='${FollowAnalyticsParams.body.video}'
                      type='video/${FollowAnalyticsParams.body.video.split('.').pop()}'>
                    `);
      const soundButtonContainer = $('#videoSound');
      const buttonPlay = $('#buttonPlay');
      //hide the video until we can play it and show the spinnner instead
      video.css({ opacity: 0 })
      source.appendTo(video);
      soundButtonContainer.html(Assets.icoSoundOff);
      soundButtonContainer.on('click', () => {
        video.prop('muted', !video.prop('muted'));
        const icon = video.prop('muted') ? Assets.icoSoundOff : Assets.icoSoundOn;
        soundButtonContainer.html(icon);
      });

      if (!!(!video.currentTime)) {
        buttonPlay.css({ display: 'initial' })
      }
      video.on('canplay', () => {
        video.css({ opacity: 1 })
        soundButtonContainer.css({ display: 'initial' })
        $('.loader').css({ display: 'none' })
      })

      buttonPlay.on('click', () => {
        video.trigger('play');
      });
      video.on('ended pause', () => {
        buttonPlay.css({ display: 'initial' })
      })
      video.on('play', () => {
        buttonPlay.css({ display: 'none' })
      })
    }
    else {
      $('.loader').css({ display: 'none' });
      if (FollowAnalyticsParams.body.topImage === null)
        video.remove();
    }

    const templateText = $('#templateText');
    const newlineRegex = /(?:\r\n|\r|\n)/g;
    templateText.html(escapeHtml(FollowAnalyticsParams.text.content).replace(newlineRegex, '<br>'));
    templateText.css({
      fontFamily: `'${FollowAnalyticsParams.text.font}'`,
      fontSize: `${FollowAnalyticsParams.text.size}px`,
      color: FollowAnalyticsParams.text.color,
    });

    const closeButtonContainer = $('#templateClose');
    closeButtonContainer.html(Assets.icoClose);
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
            });
            defaultTemplate.append(deeplinkIframe);
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
