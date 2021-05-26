using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Contact.Book.RNContactBook
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNContactBookModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNContactBookModule"/>.
        /// </summary>
        internal RNContactBookModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNContactBook";
            }
        }
    }
}
