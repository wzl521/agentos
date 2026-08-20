package com.oryxos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.nio.file.Files;
import java.nio.file.Path;

/**
 * OryxOS 启动入口。
 */
@SpringBootApplication(scanBasePackages = "com.oryxos")
public class OryxOsApplication {

    public static void main(String[] args) throws Exception {
        // SQLite 不会自动创建父目录，启动前确保 .oryxos/ 存在
        // （正式版由 oryxos init 创建完整工作区结构）
        Files.createDirectories(Path.of(".oryxos"));
        SpringApplication.run(OryxOsApplication.class, args);
    }
}
