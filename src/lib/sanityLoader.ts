'use client'

import { ImageLoaderProps } from 'next/image';

export default function sanityLoader({ src, width, quality }: ImageLoaderProps) {
  // If it's not a Sanity image (e.g. local), return as is or handled differently
  // Sanity images usually contain "cdn.sanity.io"
  if (!src.includes('cdn.sanity.io')) {
    return src;
  }
  
  // Append Sanity transformation parameters
  // Use & if ? already exists, otherwise ?
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}w=${width}&q=${quality || 75}&auto=format`;
}
