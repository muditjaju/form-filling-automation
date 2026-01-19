"use client";

import React from "react";

export default function DemoMappedForm() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700">
        <div className="p-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
              Insurance Application
            </h1>
            <p className="text-slate-400 text-lg">
              Please provide your details to map your coverage.
            </p>
          </div>

          <form className="space-y-8" action="#" method="POST" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Given Name */}
              <div className="space-y-2 group">
                <label 
                  htmlFor="given-name" 
                  className="block text-sm font-medium text-slate-300 group-focus-within:text-blue-400 transition-colors"
                >
                  Given Name
                </label>
                <input
                  type="text"
                  id="given-name"
                  name="given-name"
                  required
                  placeholder="John"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2 group">
                <label 
                  htmlFor="last-name" 
                  className="block text-sm font-medium text-slate-300 group-focus-within:text-purple-400 transition-colors"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  name="last-name"
                  required
                  placeholder="Doe"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Insurance Amount */}
            <div className="space-y-2 group">
              <label 
                htmlFor="insurance-amount" 
                className="block text-sm font-medium text-slate-300 group-focus-within:text-emerald-400 transition-colors"
              >
                Insurance Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                <input
                  type="number"
                  id="insurance-amount"
                  name="insurance-amount"
                  required
                  placeholder="500,000"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-5 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner appearance-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 group">
              <label 
                htmlFor="address" 
                className="block text-sm font-medium text-slate-300 group-focus-within:text-amber-400 transition-colors"
              >
                Full Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                placeholder="123 Luxury Lane, Beverly Hills, CA"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-inner"
              />
            </div>

            {/* ZIP Code */}
            <div className="space-y-2 group">
              <label 
                htmlFor="zip-code" 
                className="block text-sm font-medium text-slate-300 group-focus-within:text-rose-400 transition-colors"
              >
                ZIP Code
              </label>
              <input
                type="text"
                id="zip-code"
                name="zip-code"
                required
                placeholder="90210"
                maxLength={10}
                className="w-full md:w-1/3 bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all shadow-inner"
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/40 transform transition-all active:scale-[0.98] focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
        
        {/* Glow Effect Decorations */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
