
Pod::Spec.new do |s|
  s.name         = "RNContactBook"
  s.version      = "1.0.0"
  s.summary      = "RNContactBook"
  s.description  = <<-DESC
                  RNContactBook
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/author/RNContactBook.git", :tag => "master" }
  s.source_files  = "RNContactBook/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  