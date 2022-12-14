/*! device.js 0.1.55 */
;(function() {
  var a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    i,
    j =
      [].indexOf ||
      function(a) {
        for (var b = 0, c = this.length; c > b; b++)
          if (b in this && this[b] === a) return b
        return -1
      }
  ;(window.device = {}),
    (b = window.document.documentElement),
    (i = window.navigator.userAgent.toLowerCase()),
    (device.ios = function() {
      return device.iphone() || device.ipod() || device.ipad()
    }),
    (device.iphone = function() {
      return c('iphone')
    }),
    (device.ipod = function() {
      return c('ipod')
    }),
    (device.ipad = function() {
      return c('ipad')
    }),
    (device.android = function() {
      return c('android')
    }),
    (device.androidPhone = function() {
      return device.android() && c('mobile')
    }),
    (device.androidTablet = function() {
      return device.android() && !c('mobile')
    }),
    (device.blackberry = function() {
      return c('blackberry') || c('bb10') || c('rim')
    }),
    (device.blackberryPhone = function() {
      return device.blackberry() && !c('tablet')
    }),
    (device.blackberryTablet = function() {
      return device.blackberry() && c('tablet')
    }),
    (device.windows = function() {
      return c('windows')
    }),
    (device.windowsPhone = function() {
      return device.windows() && c('phone')
    }),
    (device.windowsTablet = function() {
      return device.windows() && c('touch')
    }),
    (device.mobile = function() {
      return (
        device.androidPhone() ||
        device.iphone() ||
        device.ipod() ||
        device.windowsPhone() ||
        device.blackberryPhone()
      )
    }),
    (device.tablet = function() {
      return (
        device.ipad() ||
        device.androidTablet() ||
        device.blackberryTablet() ||
        device.windowsTablet()
      )
    }),
    (device.portrait = function() {
      return 90 !== Math.abs(window.orientation)
    }),
    (device.landscape = function() {
      return 90 === Math.abs(window.orientation)
    }),
    (c = function(a) {
      return -1 !== i.indexOf(a)
    }),
    (e = function(a) {
      var c
      return (c = new RegExp(a, 'i')), b.className.match(c)
    }),
    (a = function(a) {
      return e(a) ? void 0 : (b.className += ' ' + a)
    }),
    (g = function(a) {
      return e(a) ? (b.className = b.className.replace(a, '')) : void 0
    }),
    device.ios()
      ? device.ipad()
        ? a('ios ipad tablet')
        : device.iphone()
        ? a('ios iphone mobile')
        : device.ipod() && a('ios ipod mobile')
      : device.android()
      ? device.androidTablet()
        ? a('android tablet')
        : a('android mobile')
      : device.blackberry()
      ? device.blackberryTablet()
        ? a('blackberry tablet')
        : a('blackberry mobile')
      : device.windows()
      ? device.windowsTablet()
        ? a('windows tablet')
        : device.windowsPhone()
        ? a('windows mobile')
        : a('desktop')
      : a('desktop'),
    (d = function() {
      return device.landscape()
        ? (g('portrait'), a('landscape'))
        : (g('landscape'), a('portrait'))
    }),
    (h = j.call(window, 'onorientationchange') >= 0),
    (f = h ? 'orientationchange' : 'resize'),
    window.addEventListener
      ? window.addEventListener(f, d, !1)
      : window.attachEvent
      ? window.attachEvent(f, d)
      : (window[f] = d),
    d()
}.call(this))

$(document).ready(function() {
  // 20190408 ????????? ???????????? ?????? ?????? ??? ?????? ??????
  $('.mobile .gnb a').click(function() {
    if (!$(this).hasClass('plus')) {
      $('#gnb').removeClass('active')
      $('#dim').removeClass('active')
    }
  })

  // size check
  if ($('body').outerWidth() > 1280) {
    $('html')
      .removeClass('mobile')
      .addClass('web')
  } else if ($('body').outerWidth() > 768) {
    $('html')
      .removeClass('mobile')
      .addClass('tablet')
  } else {
    $('html')
      .removeClass('web')
      .addClass('mobile')
  }

  // resize
  $(window).resize(function() {
    if ($('body').outerWidth() > 1280) {
      $('html')
        .removeClass('mobile tablet')
        .addClass('web')
    } else if ($('body').outerWidth() > 768) {
      $('html')
        .removeClass('web mobile')
        .addClass('tablet')
    } else {
      $('html')
        .removeClass('web tablet')
        .addClass('mobile')
    }
  })

  //modal draggable

  // 20190711 ?????? ????????? ?????? ??????
  $('.modal-dialog').draggable({
    handle: '.modal-header'
  })

  $('.modal-dialog.non-title').draggable({
    handle: '.modal-content'
  })
  // multi modal
  $(document).on('show.bs.modal', '.modal', function(event) {
    var zIndex = 1040 + 10 * $('.modal:visible').length
    $(this).css('z-index', zIndex)
    setTimeout(function() {
      $('.modal-backdrop')
        .not('.modal-stack')
        .css('z-index', zIndex - 1)
        .addClass('modal-stack')
    }, 0)
  })

  // 20190704 ?????? ?????????
  $('.modal').on('hidden.bs.modal', function(e) {
    if ($('.modal:visible').length) {
      $('body').addClass('modal-open')
    }
  })

  //?????? ?????? ????????? ?????????.
  // 20190416 : ????????? ?????? ?????? ?????? ??????
  /*window.onscroll = function() {myFunction()};
	var header = document.getElementById("headerWrap");
	var sticky = header.offsetTop;
	function myFunction() {
	  if (window.pageYOffset > sticky) {
		header.classList.add("sticky");
	  } else {
		header.classList.remove("sticky");
	  }
	}*/

  $('.startDate').datetimepicker({
    viewMode: 'days',
    format: 'YYYY-MM-DD',
    allowInputToggle: true
  })
  $('.endDate').datetimepicker({
    viewMode: 'days',
    format: 'YYYY-MM-DD',
    allowInputToggle: true
  })
  $('.startDate').on('dp.change', function(e) {
    $(this)
      .parent()
      .find('.endDate')
      .data('DateTimePicker')
      .minDate(e.date)
  })
  $('.endDate').on('dp.change', function(e) {
    $(this)
      .parent()
      .find('.startDate')
      .data('DateTimePicker')
      .maxDate(e.date)
  })

  $(window).on('load', function() {
    $('.scroll-box').mCustomScrollbar({
      theme: 'dark-thin',
      scrollbarPosition: 'outside'
    })
  })

  // 20190410
  var max_fields = 10
  var wrapper = $('.input-file')
  var add_button = $('.file-label')
  var x = 0
  $(add_button).click(function(e) {
    e.preventDefault()
    if (x < max_fields) {
      x++
      $(this)
        .parent()
        .append(
          '<div class="form-file">' +
            '<span><input type="file" class="form-control" placeholder=""></span>' +
            '<span><a href="#" class="btn ico-delete remove-field">??????</a></span>' +
            '</div>'
        )
      // 20190417 : ????????? dim resize
      $('.modal')
        .data('bs.modal')
        .handleUpdate()
    } else {
      alert('????????? ?????? 10????????? ?????? ???????????????.')
    }
  })

  $(wrapper).on('click', '.remove-field', function() {
    $(this)
      .parents('.form-file')
      .remove()
    x--
  })
  // 20190501 scroll table
  $(window).on('resize', function() {
    $('.table-fixed-header-wrap')
      .find('th')
      .each(function(n) {
        var $this = $(this)
        var style = { w: $this.outerWidth() }
        $('.table-fixed-header-wrap')
          .find('.fixed-th')
          .eq(n)
          .css({ width: style.w })
      })
  })
  $('.table-fixed-header-wrap')
    .find('th')
    .each(function(n) {
      var $this = $(this)
      var style = { w: $this.outerWidth() }
      $('.table-fixed-header-wrap')
        .find('.fixed-th')
        .eq(n)
        .css({ width: style.w })
    })
})

/**
 *  190614
 *  jqGrid??? ?????? ?????? ??????????????? y-scroll ????????? ?????? ??? ?????? ??????????????? ????????? ?????????
 *  ????????? ????????????????????? ???????????? ?????? DOM??? ???????????? ???????????? ????????? ???????????? ?????????.
 *  ?????? ???????????? ?????? ??????????????? ???????????? ?????????????????? ????????? ????????? ????????????
 *  ?????? ??????????????? F5??? ????????? ???????????? ??? ?????? ??????????????? ????????? ?????? DOM??? ?????? ???????????? ?????????
 *  ????????????????????? ???????????? change ????????????????????? ????????? ?????????????????? ????????? ????????? ??? ??????.
 *  ????????? ????????? ?????? ??????????????? ??????????????? Vue ????????? ?????? ????????? ????????? ?????? ?????? ???????????????.
 *  History ????????? ????????? ?????? ????????? ????????????, ?????? ?????? ????????????
 *  ??? ????????? ?????? ?????? ??????????????? ??????????????? ???????????? ??????.
 * */
/*
$(document).ready(function() {
	// scrollbar
	$(window).on("load",function(){
		// ??????  + ?????? ?????????
		$(".y-scroll").mCustomScrollbar({
			axis:"yx",
			theme:"minimal-dark",
			scrollbarPosition: "outside",
			autoHideScrollbar : true,
			callbacks:{
				whileScrolling:function(){
					var fixedHeader = $(this).find('.fixed-header')
					if (fixedHeader.length){
						fixedHeader.css({
							'transform': 'translate(' + this.mcs.left + 'px, 0)'
						});
					}
					// 20190416 : ?????? tfoot ??????
					var fixedFooter= $(this).find('.fixed-footer')
					if (fixedFooter.length){
						fixedFooter.css({
							'transform': 'translate(' + this.mcs.left + 'px, 0)'
						});
					}
				},
				onUpdate : function(){
					$(this).TableFixedHeader('resizing');
					// 20190416 : ?????? tfoot ??????
					$(this).TableFixedFooter('resizing2');
				}
			}
		});
		// 190403 ?????? ?????? ?????????
		$(".y-scroll-only").mCustomScrollbar({
			axis:"y",
			theme:"minimal-dark",
			scrollbarPosition: "outside",
			autoHideScrollbar : true,
			callbacks:{
				whileScrolling:function(){
					var fixedHeader = $(this).find('.fixed-header')
					if (fixedHeader.length){
						fixedHeader.css({
							'transform': 'translate(' + this.mcs.left + 'px, 0)'
						});
					}
					// 20190416 : ?????? tfoot ??????
					var fixedFooter= $(this).find('.fixed-footer')
					if (fixedFooter.length){
						fixedFooter.css({
							'transform': 'translate(' + this.mcs.left + 'px, 0)'
						});
					}
				},
				onUpdate : function(){
					$(this).TableFixedHeader('resizing');
					// 20190416 : ?????? tfoot ??????
					$(this).TableFixedFooter('resizing2');
				}
			}
		});
	});
});
*/

/* ????????? ????????? ?????? ?????? ???????????? */
;(function($, undefined) {
  'use strict'
  var TableFixedHeader = function(elem) {
    this.$elem = elem
    this.init()
  }

  TableFixedHeader.prototype = {
    /*
     * ?????????
     * ????????? ?????? ?????? ???????????? ??????.
     */
    init: function() {
      var header = this.thSort()
      var el = $('<div class="fixed-header">')
      this.fixed = $('.fixed-header')
      header.find('th').each(function() {
        var $this = $(this)
        var div = $('<div class="th">')
        var span = $('<span>')
        var childrens = $this[0].childNodes
        var i
        for (i = 0; i < childrens.length; i += 1) {
          span.append(childrens[i].cloneNode(true))
        }
        if ($this.attr('class')) div.addClass($this.attr('class'))
        div.append(span)
        el.append(div)
      })
      this.$elem.find('.mCustomScrollBox').append(el)
      this.resizing()
      this.posReset()
    },

    /**
     * thead ?????? ??????
     */
    thSort: function() {
      var target = this.$elem.find('thead')
      return target
    },

    /**
     * ???????????? ?????????
     */
    posReset: function() {
      var that = this
      $(window).on('resize', function() {
        that.resizing()
      })
    },

    /**
     * ???????????? ????????? ??????
     */
    resizing: function() {
      var header = this.thSort()
      var el = this.$elem.find('.fixed-header')
      header.find('th').each(function(n) {
        var $this = $(this)
        var style = {
          w: $this.outerWidth(),
          h: $this.outerHeight(),
          x: $this.position().left
        }
        el.find('div.th')
          .eq(n)
          .css({ width: style.w, height: style.h, left: style.x + 'px' })
      })
    },

    /**
     * ?????? ?????? ??????
     * $(element).TableFixedHeader('distory') ???????????? ??????
     */
    distory: function() {
      this.$elem.find('.fixed-header').remove()
    },

    /**
     * ?????? ?????? ??? ??????
     * $(element).TableFixedHeader('enable') ???????????? ??????
     */
    enable: function() {
      this.init()
    }
  }
  function Plugin(method) {
    var $this = $(this)
    var data = $this.data('TableFixedHeader')
    if (!data)
      $this.data('TableFixedHeader', (data = new TableFixedHeader(this)))
    if (method) data[method]()
  }

  $.fn.TableFixedHeader = Plugin
  $.fn.TableFixedHeader.Constructor = TableFixedHeader
})(jQuery)

//  20190416 : ?????? tfoot ??????
/* ????????? ????????? ?????? ?????? ???????????? */
;(function($, undefined) {
  'use strict'
  var TableFixedFooter = function(elem) {
    this.$elem = elem
    this.init()
  }

  TableFixedFooter.prototype = {
    init: function() {
      var footer = this.tdSort()
      var el = $('<div class="fixed-footer">')
      this.fixed = $('.fixed-footer')
      footer.find('td').each(function() {
        var $this = $(this)
        var div = $('<div class="td">')
        var span = $('<span>')
        var childrens = $this[0].childNodes
        var i
        for (i = 0; i < childrens.length; i += 1) {
          span.append(childrens[i].cloneNode(true))
        }
        if ($this.attr('class')) div.addClass($this.attr('class'))
        div.append(span)
        el.append(div)
      })
      this.$elem.find('.mCustomScrollBox').append(el)
      this.resizing2()
      this.posReset2()
    },

    /**
     * tfoot ?????? ??????
     */
    tdSort: function() {
      var target = this.$elem.find('tfoot')
      return target
    },

    /**
     * ???????????? ?????????
     */
    posReset2: function() {
      var that = this
      $(window).on('resize', function() {
        that.resizing2()
      })
    },

    /**
     * ?????? tfoot ????????? ??????
     */
    resizing2: function() {
      var footer = this.tdSort()
      var el = this.$elem.find('.fixed-footer')
      footer.find('td').each(function(n) {
        var $this = $(this)
        var style = {
          w: $this.outerWidth(),
          h: $this.outerHeight(),
          x: $this.position().left
        }
        el.find('div.td')
          .eq(n)
          .css({ width: style.w, height: style.h, left: style.x + 'px' })
      })
    },

    /**
     * ?????? tfoot ??????
     * $(element).TableFixedHeader('distory2') ???????????? ??????
     */
    distory2: function() {
      this.$elem.find('.fixed-footer').remove()
    },

    /**
     * ?????? tfoot ??? ??????
     * $(element).TableFixedFooter('enable2') ???????????? ??????
     */
    enable2: function() {
      this.init()
    }
  }
  function Plugin2(method) {
    var $this = $(this)
    var data = $this.data('TableFixedFooter')
    if (!data)
      $this.data('TableFixedFooter', (data = new TableFixedFooter(this)))
    if (method) data[method]()
  }

  $.fn.TableFixedFooter = Plugin2
  $.fn.TableFixedFooter.Constructor = TableFixedFooter
})(jQuery)

// 20190603 ?????? ?????? ??????
$(document).ready(function() {
  $('.thema-setting .red').click(uplus)
  $('.thema-setting .blue').click(blue)
  $('.thema-setting .green').click(green)
  function uplus() {
    $('#bodyWrap').attr('class', 'main')
  }
  function blue() {
    $('#bodyWrap').attr('class', 'main type-blue')
  }
  function green() {
    $('#bodyWrap').attr('class', 'main type-green')
  }
})
