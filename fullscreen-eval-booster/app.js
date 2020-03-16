import $ from 'jquery';
import _ from 'lodash';
import './css/main.scss';
import './css/style.scss';
import Assets from './assets/assets';
import {escapeHtml, handleConsoleMessage} from './lib/utils';
import {FollowAnalyticsWrapper} from './lib/FollowAnalyticsWrapper';

const CURRENT_PAGE_KEY = 'currentPage';
let currentPage = 'eval';
let inappClosed = false;

const handleDeeplinkClick = (element) => {
  if (FollowAnalyticsWrapper.checkMinSdkVersion(6, 3, 0)) {
    window.location.href = element.deeplink_url;
  }
  else {
    const deeplinkIframe = $(`
        <iframe
          src="${element.deeplink_url}"
          class="deeplinkFrame"
          sandbox="allow-same-origin allow-scripts"
          frameborder="0">
        </iframe>
      `);
    deeplinkIframe.on('load', () => {
      deeplinkIframe.css({transform: 'scale(1)'});
      // Wait for the animation of the iframe to end
      // Before showing the close button
      setTimeout(() => $(`#${currentPage}`).prepend(closeButtonHtml), 700);
    });
    $('body').prepend(deeplinkIframe);
  }
};

const setActivePage = (newPage) => {
  $('.page').each((_idx, pageNode) => {
    const pageId = pageNode.getAttribute('id');
    pageNode.removeAttribute('class');
    pageNode.className = 'page';
    switch (pageId) {
      case 'page-eval': {
        if (newPage !== pageId) {
          pageNode.classList.add('page--previous');
        }
        else pageNode.classList.add('page--current');
        break;
      }
      case 'page-pos':
      case 'page-neg':
        if (newPage === pageId) {
          pageNode.classList.add('page--current');
        }
        else {
          pageNode.classList.add('page--next');
        }
    }
  });

  currentPage = newPage;
  if (typeof FollowAnalytics.CurrentCampaign.setData === 'function') {
    FollowAnalytics.CurrentCampaign.setData(CURRENT_PAGE_KEY, newPage);
  }
};

$(window).on('load', () => {
  try {
    const FollowAnalytics = new FollowAnalyticsWrapper().FollowAnalytics;
    if (typeof FollowAnalytics.CurrentCampaign.getData === 'function') {
      const savedPage = FollowAnalytics.CurrentCampaign.getData(CURRENT_PAGE_KEY);
      currentPage = savedPage || 'eval';
    }
    if (typeof FollowAnalyticsParams === 'undefined') {
      throw {severity: 'warning', message: 'Missing template parameters, shutting down.'};
    }

    // Global configs
    const templateContainer = $('.template');
    templateContainer.css({
      backgroundColor: FollowAnalyticsParams.global_params.background,
      fontFamily: FollowAnalyticsParams.global_params.font,
    });

    // Page configs
    const allPages = [
      {
        id: 'page-eval',
        label: 'Evaluation Page',
        params: _.first(FollowAnalyticsParams.rating_page),
        buttonsDisabled: false,
      },
      {
        id: 'page-pos',
        label: 'Positive Feedback Page',
        params: _.first(FollowAnalyticsParams.positive_feedback_page),
        buttonsDisabled: false,
      },
      {
        id: 'page-neg',
        label: 'Negative Feedback Page',
        params: _.first(FollowAnalyticsParams.negative_feedback_page),
        buttonsDisabled: false,
      },
    ];
    _.forEach(allPages, (pageObj) => {
      const page = pageObj.params;
      // Background config
      const pageContainer = $(`<div id="${pageObj.id}" class="page" />`)
      pageContainer.css({backgroundColor: page.background.color});

      // Close button configs
      const closeButtonHtml = $('<div class="page__close">');
      closeButtonHtml.html(Assets.icoClose);
      closeButtonHtml.find('svg').css({fill: page.close_button.color});
      closeButtonHtml.on('click', () => {
        if (!inappClosed) {
          if (FollowAnalytics.CurrentCampaign.logAction) {
            FollowAnalytics.CurrentCampaign.logAction(`${pageObj.label}: Dismiss`);
          }
          $('.deeplinkFrame').removeAttr('style');
          $('body').removeClass('overlay');
          $('body').find('.page__close').remove();
          setTimeout(() => FollowAnalytics.CurrentCampaign.close(), 700);
        }
      });
      pageContainer.append(closeButtonHtml);

      // Uploaded image config
      if (!!page.image.upload) {
        const imageHtml = $(`<img class="page__image" src="${page.image.upload}" alt="" />`);
        pageContainer.append(imageHtml);
      }

      const pageInfoContainer = $('<div class="page__info" />')

      // Title text configs
      const titleContainer = $('<div class="page__info__title" />');
      const titleHtml = $('<span />');
      titleHtml.text(page.title.text);
      titleHtml.css({color: page.title.color});
      titleContainer.append(titleHtml);
      pageInfoContainer.append(titleContainer);

      // Body text configs
      if (page.body.text !== '') {
        const bodyContainer = $('<div class="page__info__body" />');
        const bodyHtml = $('<span />');
        bodyHtml.html(escapeHtml(page.body.text));
        bodyHtml.css({color: page.body.color});
        bodyContainer.append(bodyHtml);
        pageInfoContainer.append(bodyContainer);
      }

      const buttonsContainer = $('<div class="page__info__buttons" />');
      const allButtons = [page.positive_answer_btn, page.negative_answer_btn];
      _.forEach(allButtons, (btn) => {
        const buttonHtml = $(`<div class="button"><span>${btn.text}</span></div>`);
        buttonHtml.css({
          backgroundColor: btn.background,
          color: btn.text_color,
        });

        buttonHtml.on('click', () => {
          if (page.buttonsDisabled) return;
          else page.buttonsDisabled = true;

          if (FollowAnalytics.CurrentCampaign.logAction) {
            FollowAnalytics.CurrentCampaign.logAction(`${pageObj.label}: ${btn.text}`);
          }
          if (currentPage !== 'page-eval' && btn.deeplink_url && btn.deeplink_url !== '') {
            handleDeeplinkClick(btn);
          }
          else if (currentPage !== 'page-eval' && !inappClosed) {
            inappClosed = true;
            $('body').removeClass('overlay');
            setTimeout(() => FollowAnalytics.CurrentCampaign.close(), 700);
          }
          else {
            // Go to positive reply page
            if (_.isEqual(btn, page.positive_answer_btn)) setActivePage(allPages[1].id);
            // Go to negative reply page
            else setActivePage(allPages[2].id);
          };
        });
        buttonsContainer.append(buttonHtml);
      });
      // if (!page.action || !page.action.enabled) {
      //   buttonsContainer.css({marginBottom: 'auto'});
      // }
      pageInfoContainer.append(buttonsContainer);

      // NOTE: Disabled for now
      // if (page.action && page.action.enabled) {
      //   const actionHtml = $(`<span class="page__info__action">${page.action.text}</span>`);
      //   actionHtml.css({color: page.action.color});
      //   actionHtml.on('click', () => {
      //     if (FollowAnalytics && FollowAnalytics.CurrentCampaign.logAction) {
      //       FollowAnalytics.CurrentCampaign.logAction(`${pageObj.label}: ${page.action.text}`);
      //     }
      //     if (page.action.deeplink_url && page.action.deeplink_url !== '') {
      //       handleDeeplinkClick(page.action);
      //     }
      //     else {
      //       inappClosed = true;
      //       $('body').removeClass('overlay');
      //       setTimeout(() => FollowAnalytics.CurrentCampaign.close(), 700);
      //     }
      //   });
      //   pageInfoContainer.append(actionHtml);
      // }

      pageContainer.append(pageInfoContainer);
      templateContainer.append(pageContainer);
    });

    setActivePage(allPages[0].id);
    setTimeout(() => $('body').addClass('overlay'), 400);
  }
  catch (e) {
    handleConsoleMessage(e);
  }
});
