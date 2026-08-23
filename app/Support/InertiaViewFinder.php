<?php

namespace App\Support;

use Illuminate\View\FileViewFinder;
use InvalidArgumentException;

class InertiaViewFinder extends FileViewFinder
{
    /**
     * Find the given view on the filesystem.
     *
     * @param  string  $name
     * @return string
     */
    public function find($name)
    {
        if (isset($this->views[$name])) {
            return $this->views[$name];
        }

        $segments = explode('/', trim($name));

        if (count($segments) > 1) {
            $feature = array_shift($segments);
            $featureRelativePath = "{$feature}/pages/".implode('/', $segments);

            try {
                return $this->views[$name] = $this->findInPaths($featureRelativePath, [resource_path('js/features')]);
            } catch (InvalidArgumentException) {
                // Fall back to standard search in paths
            }
        }

        return parent::find($name);
    }
}
