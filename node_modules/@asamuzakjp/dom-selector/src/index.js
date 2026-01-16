/*!
 * DOM Selector - A CSS selector engine.
 * @license MIT
 * @copyright asamuzaK (Kazz)
 * @see {@link https://github.com/asamuzaK/domSelector/blob/main/LICENSE}
 */

/* import */
import { Finder } from './js/finder.js';
import { filterSelector, getType, initNwsapi } from './js/utility.js';

/* constants */
import {
  COMBO, COMPOUND_I, DESCEND, DOCUMENT_NODE, ELEMENT_NODE, SIBLING,
  TAG_ID_CLASS, TARGET_ALL, TARGET_FIRST, TARGET_LINEAL, TARGET_SELF
} from './js/constant.js';
const REG_COMPLEX = new RegExp(`${COMPOUND_I}${COMBO}${COMPOUND_I}`, 'i');
const REG_DESCEND = new RegExp(`${COMPOUND_I}${DESCEND}${COMPOUND_I}`, 'i');
const REG_SIBLING = new RegExp(`${COMPOUND_I}${SIBLING}${COMPOUND_I}`, 'i');
const REG_SIMPLE = new RegExp(`^${TAG_ID_CLASS}$`);

/* DOMSelector */
export class DOMSelector {
  /* private fields */
  #window;
  #document;
  #domSymbolTree;
  #finder;
  #idlUtils;
  #nwsapi;

  /**
   * construct
   * @param {object} window - window
   * @param {object} document - document
   * @param {object} [opt] - options
   */
  constructor(window, document, opt = {}) {
    const { domSymbolTree, idlUtils } = opt;
    this.#window = window;
    this.#document = document ?? window.document;
    this.#domSymbolTree = domSymbolTree;
    this.#finder = new Finder(window);
    this.#idlUtils = idlUtils;
    this.#nwsapi = initNwsapi(window, document);
  }

  /**
   * @typedef CheckResult
   * @type {object}
   * @property {boolean} match - match result excluding pseudo-element selector
   * @property {string?} pseudoElement - pseudo-element selector
   */

  /**
   * check
   * @param {string} selector - CSS selector
   * @param {object} node - Element node
   * @param {object} [opt] - options
   * @returns {CheckResult} - check result
   */
  check(selector, node, opt = {}) {
    if (!node?.nodeType) {
      const e = new this.#window.TypeError(`Unexpected type ${getType(node)}`);
      this.#finder.onError(e, opt);
    } else if (node.nodeType !== ELEMENT_NODE) {
      const e = new this.#window.TypeError(`Unexpected node ${node.nodeName}`);
      this.#finder.onError(e, opt);
    }
    const document = this.#domSymbolTree
      ? node._ownerDocument
      : node.ownerDocument;
    if (document === this.#document && document.contentType === 'text/html' &&
        document.documentElement && node.parentNode) {
      const filterOpt = {
        complex: REG_COMPLEX.test(selector),
        compound: false,
        descend: false,
        simple: false,
        target: TARGET_SELF
      };
      if (filterSelector(selector, filterOpt)) {
        try {
          const n = this.#idlUtils ? this.#idlUtils.wrapperForImpl(node) : node;
          const match = this.#nwsapi.match(selector, n);
          return {
            match,
            pseudoElement: null
          };
        } catch (e) {
          // fall through
        }
      }
    }
    let res;
    try {
      // FIXME: remove later
      if (this.#idlUtils) {
        node = this.#idlUtils.wrapperForImpl(node);
      }
      opt.domSymbolTree = this.#domSymbolTree;
      opt.check = true;
      opt.noexept = true;
      opt.warn = false;
      this.#finder.setup(selector, node, opt);
      res = this.#finder.find(TARGET_SELF);
    } catch (e) {
      this.#finder.onError(e, opt);
    }
    return res;
  }

  /**
   * matches
   * @param {string} selector - CSS selector
   * @param {object} node - Element node
   * @param {object} [opt] - options
   * @returns {boolean} - `true` if matched `false` otherwise
   */
  matches(selector, node, opt = {}) {
    if (!node?.nodeType) {
      const e = new this.#window.TypeError(`Unexpected type ${getType(node)}`);
      this.#finder.onError(e, opt);
    } else if (node.nodeType !== ELEMENT_NODE) {
      const e = new this.#window.TypeError(`Unexpected node ${node.nodeName}`);
      this.#finder.onError(e, opt);
    }
    const document = this.#domSymbolTree
      ? node._ownerDocument
      : node.ownerDocument;
    if (document === this.#document && document.contentType === 'text/html' &&
        document.documentElement && node.parentNode) {
      const filterOpt = {
        complex: REG_COMPLEX.test(selector),
        compound: false,
        descend: false,
        simple: false,
        target: TARGET_SELF
      };
      if (filterSelector(selector, filterOpt)) {
        try {
          const n = this.#idlUtils ? this.#idlUtils.wrapperForImpl(node) : node;
          const res = this.#nwsapi.match(selector, n);
          return res;
        } catch (e) {
          // fall through
        }
      }
    }
    let res;
    try {
      // FIXME: remove later
      if (this.#idlUtils) {
        node = this.#idlUtils.wrapperForImpl(node);
      }
      opt.domSymbolTree = this.#domSymbolTree;
      this.#finder.setup(selector, node, opt);
      const nodes = this.#finder.find(TARGET_SELF);
      res = nodes.size;
    } catch (e) {
      this.#finder.onError(e, opt);
    }
    return !!res;
  }

  /**
   * closest
   * @param {string} selector - CSS selector
   * @param {object} node - Element node
   * @param {object} [opt] - options
   * @returns {?object} - matched node
   */
  closest(selector, node, opt = {}) {
    if (!node?.nodeType) {
      const e = new this.#window.TypeError(`Unexpected type ${getType(node)}`);
      this.#finder.onError(e, opt);
    } else if (node.nodeType !== ELEMENT_NODE) {
      const e = new this.#window.TypeError(`Unexpected node ${node.nodeName}`);
      this.#finder.onError(e, opt);
    }
    const document = this.#domSymbolTree
      ? node._ownerDocument
      : node.ownerDocument;
    if (document === this.#document && document.contentType === 'text/html' &&
        document.documentElement && node.parentNode) {
      const filterOpt = {
        complex: REG_COMPLEX.test(selector),
        compound: false,
        descend: false,
        simple: false,
        target: TARGET_LINEAL
      };
      if (filterSelector(selector, filterOpt)) {
        try {
          const n = this.#idlUtils ? this.#idlUtils.wrapperForImpl(node) : node;
          const res = this.#nwsapi.closest(selector, n);
          return res;
        } catch (e) {
          // fall through
        }
      }
    }
    let res;
    try {
      // FIXME: remove later
      if (this.#idlUtils) {
        node = this.#idlUtils.wrapperForImpl(node);
      }
      opt.domSymbolTree = this.#domSymbolTree;
      this.#finder.setup(selector, node, opt);
      const nodes = this.#finder.find(TARGET_LINEAL);
      if (nodes.size) {
        let refNode = node;
        while (refNode) {
          if (nodes.has(refNode)) {
            res = refNode;
            break;
          }
          refNode = refNode.parentNode;
        }
      }
    } catch (e) {
      this.#finder.onError(e, opt);
    }
    return res ?? null;
  }

  /**
   * query selector
   * @param {string} selector - CSS selector
   * @param {object} node - Document, DocumentFragment, Element node
   * @param {object} [opt] - options
   * @returns {?object} - matched node
   */
  querySelector(selector, node, opt = {}) {
    if (!node?.nodeType) {
      const e = new this.#window.TypeError(`Unexpected type ${getType(node)}`);
      this.#finder.onError(e, opt);
    }
    let res;
    try {
      // FIXME: remove later
      if (this.#idlUtils) {
        node = this.#idlUtils.wrapperForImpl(node);
      }
      opt.domSymbolTree = this.#domSymbolTree;
      this.#finder.setup(selector, node, opt);
      const nodes = this.#finder.find(TARGET_FIRST);
      if (nodes.size) {
        [res] = [...nodes];
      }
    } catch (e) {
      this.#finder.onError(e, opt);
    }
    return res ?? null;
  }

  /**
   * query selector all
   * NOTE: returns Array, not NodeList
   * @param {string} selector - CSS selector
   * @param {object} node - Document, DocumentFragment, Element node
   * @param {object} [opt] - options
   * @returns {Array.<object|undefined>} - collection of matched nodes
   */
  querySelectorAll(selector, node, opt = {}) {
    if (!node?.nodeType) {
      const e = new this.#window.TypeError(`Unexpected type ${getType(node)}`);
      this.#finder.onError(e, opt);
    }
    let document;
    if (this.#domSymbolTree) {
      document = node._ownerDocument;
    } else if (node.nodeType === DOCUMENT_NODE) {
      document = node;
    } else {
      document = node.ownerDocument;
    }
    if (document === this.#document && document.contentType === 'text/html' &&
        document.documentElement) {
      const filterOpt = {
        complex: false,
        compound: false,
        descend: REG_DESCEND.test(selector) && !REG_SIBLING.test(selector),
        simple: REG_SIMPLE.test(selector),
        target: TARGET_ALL
      };
      if (filterSelector(selector, filterOpt)) {
        try {
          const n = this.#idlUtils ? this.#idlUtils.wrapperForImpl(node) : node;
          const res = this.#nwsapi.select(selector, n);
          return res;
        } catch (e) {
          // fall through
        }
      }
    }
    let res;
    try {
      // FIXME: remove later
      if (this.#idlUtils) {
        node = this.#idlUtils.wrapperForImpl(node);
      }
      opt.domSymbolTree = this.#domSymbolTree;
      this.#finder.setup(selector, node, opt);
      const nodes = this.#finder.find(TARGET_ALL);
      if (nodes.size) {
        res = [...nodes];
      }
    } catch (e) {
      this.#finder.onError(e, opt);
    }
    return res ?? [];
  }
}
